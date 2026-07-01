import { prisma } from "../../config/database";
import { NotFoundError, ConflictError } from "../../shared/errors/AppError";

export class UsersService {
  /**
   * List storefront users with search, pagination, and status filters
   */
  async listUsers(filters: { page: number; limit: number; search?: string; status?: string }) {
    const { page, limit, search, status } = filters;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (status) {
      where.isActive = status === "active";
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          avatar: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user details by ID
   */
  async getUserById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        isActive: true,
        addresses: true,
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("Customer profile not found");
    }

    return user;
  }

  /**
   * Update storefront user properties
   */
  async updateUser(id: string, data: any) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundError("Customer profile not found");
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
      },
    });

    return updated;
  }

  /**
   * Soft delete a storefront user
   */
  async deleteUser(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundError("Customer profile not found");
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return null;
  }

  // ----------------------------------------------------
  // CUSTOMER SELF-MANAGED PROFILE & ADDRESSES
  // ----------------------------------------------------

  async getMyProfile(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User profile not found");
    }

    return user;
  }

  async updateMyProfile(userId: string, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phone: data.phone,
        avatar: data.avatar,
      },
    });
  }

  async addAddress(userId: string, data: any) {
    const addressCount = await prisma.address.count({ where: { userId } });
    if (addressCount >= 5) {
      throw new ConflictError("Maximum 5 addresses allowed");
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        userId,
        fullName: data.fullName,
        phone: data.phone,
        street: data.addressLine1 + (data.addressLine2 ? ", " + data.addressLine2 : ""),
        city: data.city,
        state: data.state,
        postalCode: data.zipCode,
        country: data.country || "India",
        isDefault: data.isDefault || false,
      },
    });
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundError("Address profile not found");
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updateData: any = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.country !== undefined) updateData.country = data.country;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;
    if (data.zipCode !== undefined) updateData.postalCode = data.zipCode;
    if (data.addressLine1 !== undefined) {
      updateData.street = data.addressLine1 + (data.addressLine2 ? ", " + data.addressLine2 : "");
    } else if (data.street !== undefined) {
      updateData.street = data.street;
    }

    return prisma.address.update({
      where: { id: addressId },
      data: updateData,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundError("Address profile not found");
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return null;
  }

  async setDefaultAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundError("Address profile not found");
    }

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    return prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
export const usersService = new UsersService();
