import { prisma } from "../../config/database";
import { NotFoundError, ConflictError } from "../../shared/errors/AppError";

export class CartService {
  /**
   * Get user's cart with items and product details
   */
  async getCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            // We'll manually include product details since CartItem doesn't have a relation
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: { items: true },
      });
    }

    // Fetch product details for each cart item
    const itemsWithProducts = await Promise.all(
      cart.items.map(async (item) => {
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
          },
        });

        const variant = item.variantId
          ? await prisma.productVariant.findUnique({
              where: { id: item.variantId },
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                sku: true,
              },
            })
          : null;

        return {
          ...item,
          product,
          variant,
          currentPrice: variant?.price || product?.price || 0,
          inStock: (variant?.stock || product?.stock || 0) >= item.quantity,
        };
      })
    );

    // Calculate totals
    const subtotal = itemsWithProducts.reduce(
      (sum, item) => sum + item.currentPrice * item.quantity,
      0
    );
    const itemCount = itemsWithProducts.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      items: itemsWithProducts,
      subtotal,
      itemCount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  /**
   * Add item to cart (or increase quantity if already exists)
   */
  async addItem(userId: string, data: { productId: string; variantId?: string | null; quantity?: number }) {
    const quantity = data.quantity || 1;

    // Verify product exists and is active
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundError("Product not found or unavailable");
    }

    // Check stock from InventoryStock
    const defaultWarehouse = await prisma.warehouse.findFirst();
    let availableStock = 0;
    if (defaultWarehouse) {
      const stock = await prisma.inventoryStock.findFirst({
        where: {
          warehouseId: defaultWarehouse.id,
          productId: data.productId,
          variantId: data.variantId || null,
        },
      });
      availableStock = stock?.quantity || 0;
    }

    if (availableStock < quantity) {
      throw new ConflictError(`Insufficient stock. Available: ${availableStock}`);
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
        variantId: data.variantId || null,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > availableStock) {
        throw new ConflictError(`Cannot add more. Already in cart: ${existingItem.quantity}, Available: ${availableStock}`);
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          variantId: data.variantId || null,
          quantity,
        },
      });
    }

    return this.getCart(userId);
  }

  /**
   * Update cart item quantity
   */
  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundError("Cart item not found");
    }

    // Check stock from InventoryStock
    const defaultWarehouse = await prisma.warehouse.findFirst();
    let availableStock = 0;
    if (defaultWarehouse) {
      const stock = await prisma.inventoryStock.findFirst({
        where: {
          warehouseId: defaultWarehouse.id,
          productId: item.productId,
          variantId: item.variantId || null,
        },
      });
      availableStock = stock?.quantity || 0;
    }

    if (quantity > availableStock) {
      throw new ConflictError(`Insufficient stock. Available: ${availableStock}`);
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.getCart(userId);
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId: string, itemId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundError("Cart item not found");
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return this.getCart(userId);
  }

  /**
   * Clear entire cart
   */
  async clearCart(userId: string) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return this.getCart(userId);
  }
}

export const cartService = new CartService();
