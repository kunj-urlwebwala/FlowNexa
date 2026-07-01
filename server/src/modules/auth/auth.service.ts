import { prisma } from "../../config/database";
import { hashPassword, verifyPassword } from "../../shared/utils/hash.util";
import { generateAccessToken, generateRefreshToken, TokenPayload, verifyRefreshToken } from "../../shared/utils/jwt.util";
import { AppError, AuthenticationError, ConflictError, NotFoundError } from "../../shared/errors/AppError";
import { AdminRole, AdminStatus } from "@prisma/client";

export class AuthService {
  /**
   * Register a storefront user (customer)
   */
  async registerUser(data: any) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: "CUSTOMER",
      isAdmin: false,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }

  /**
   * Login a storefront user
   */
  async loginUser(data: any) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || user.deletedAt) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new AuthenticationError("User account is deactivated");
    }

    const isMatch = await verifyPassword(user.password, data.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid email or password");
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: "CUSTOMER",
      isAdmin: false,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Login an admin user
   */
  async loginAdmin(data: any) {
    const admin = await prisma.adminUser.findUnique({
      where: { email: data.email },
    });

    if (!admin || admin.deletedAt) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (admin.status !== AdminStatus.ACTIVE) {
      throw new AuthenticationError(`Account status is ${admin.status.toLowerCase()}`);
    }

    const isMatch = await verifyPassword(admin.password, data.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid email or password");
    }

    // Update last active
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastActive: new Date() },
    });

    const payload: TokenPayload = {
      userId: admin.id,
      email: admin.email,
      role: admin.role,
      username: admin.username,
      isAdmin: true,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      admin: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh token
   */
  async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);

      if (decoded.isAdmin) {
        const admin = await prisma.adminUser.findUnique({
          where: { id: decoded.userId },
        });

        if (!admin || admin.status !== AdminStatus.ACTIVE || admin.deletedAt) {
          throw new AuthenticationError("Admin user no longer active");
        }

        const payload: TokenPayload = {
          userId: admin.id,
          email: admin.email,
          role: admin.role,
          username: admin.username,
          isAdmin: true,
        };

        return {
          accessToken: generateAccessToken(payload),
          refreshToken: generateRefreshToken(payload),
        };
      } else {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user || !user.isActive || user.deletedAt) {
          throw new AuthenticationError("User no longer active");
        }

        const payload: TokenPayload = {
          userId: user.id,
          email: user.email,
          role: "CUSTOMER",
          isAdmin: false,
        };

        return {
          accessToken: generateAccessToken(payload),
          refreshToken: generateRefreshToken(payload),
        };
      }
    } catch (error) {
      throw new AuthenticationError("Invalid or expired refresh token");
    }
  }
}
export const authService = new AuthService();
