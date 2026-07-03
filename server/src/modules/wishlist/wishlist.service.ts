import { prisma } from "../../config/database";
import { NotFoundError, ConflictError } from "../../shared/errors/AppError";

export class WishlistService {
  /**
   * Get user's wishlist with product details
   */
  async getWishlist(userId: string) {
    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Fetch product details for each wishlist item
    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            stock: true,
            isActive: true,
            category: { select: { name: true } },
            brand: { select: { name: true } },
          },
        });

        return {
          ...item,
          product,
          inStock: (product?.stock || 0) > 0,
        };
      })
    );

    return itemsWithProducts;
  }

  /**
   * Add product to wishlist
   */
  async addItem(userId: string, productId: string) {
    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundError("Product not found or unavailable");
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      throw new ConflictError("Product already in wishlist");
    }

    await prisma.wishlistItem.create({
      data: { userId, productId },
    });

    return this.getWishlist(userId);
  }

  /**
   * Remove product from wishlist
   */
  async removeItem(userId: string, itemId: string) {
    const item = await prisma.wishlistItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundError("Wishlist item not found");
    }

    await prisma.wishlistItem.delete({ where: { id: itemId } });

    return this.getWishlist(userId);
  }

  /**
   * Check if a product is in user's wishlist
   */
  async checkItem(userId: string, productId: string) {
    const item = await prisma.wishlistItem.findFirst({
      where: { userId, productId },
    });

    return { inWishlist: !!item, itemId: item?.id || null };
  }
}

export const wishlistService = new WishlistService();
