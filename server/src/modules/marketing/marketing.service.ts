import { prisma } from "../../config/database";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class MarketingService {
  // ----------------------------------------------------
  // COUPONS
  // ----------------------------------------------------

  async listCoupons(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.coupon.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.coupon.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createCoupon(data: any) {
    const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictError("Coupon code already exists");

    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        expiryDate: data.expiryDate,
      },
    });
  }

  async updateCouponStatus(id: string, isActive: boolean) {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundError("Coupon code not found");

    return prisma.coupon.update({
      where: { id },
      data: { isActive },
    });
  }

  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      throw new NotFoundError("Invalid or inactive coupon code");
    }

    if (new Date() > coupon.expiryDate) {
      throw new ConflictError("Coupon code has expired");
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new ConflictError(`Minimum purchase of ₹${coupon.minOrderAmount} required for this coupon`);
    }

    return coupon;
  }

  // ----------------------------------------------------
  // EMAIL TEMPLATES
  // ----------------------------------------------------

  async listTemplates(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.emailTemplate.findMany({ skip, take: limit, orderBy: { name: "asc" } }),
      prisma.emailTemplate.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createTemplate(data: any) {
    const existing = await prisma.emailTemplate.findFirst({
      where: {
        OR: [{ name: data.name }, { triggerEvent: data.triggerEvent }],
      },
    });

    if (existing) {
      throw new ConflictError("Template name or trigger event already registered");
    }

    return prisma.emailTemplate.create({
      data: {
        name: data.name,
        subject: data.subject,
        body: data.body,
        triggerEvent: data.triggerEvent,
      },
    });
  }

  // ----------------------------------------------------
  // NEWSLETTER SUBSCRIBERS
  // ----------------------------------------------------

  async listSubscribers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.newsletterSubscriber.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async addSubscriber(email: string) {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        return prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
      }
      return existing; // already active subscriber
    }

    return prisma.newsletterSubscriber.create({
      data: { email },
    });
  }
}
export const marketingService = new MarketingService();
