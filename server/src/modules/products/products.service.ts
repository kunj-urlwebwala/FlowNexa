import { prisma } from "../../config/database";
import { generateSlug } from "../../shared/utils/slug.util";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class ProductsService {
  /**
   * List storefront products with filters, sorting, and pagination
   */
  async listProducts(filters: {
    page: number;
    limit: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy: string;
  }) {
    const { page, limit, search, category, brand, minPrice, maxPrice, sortBy } = filters;
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null, isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = {
        OR: [
          { id: category },
          { slug: category },
        ],
      };
    }

    if (brand) {
      where.brand = {
        OR: [
          { id: brand },
          { slug: brand },
        ],
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "price_asc") {
      orderBy = { price: "asc" };
    } else if (sortBy === "price_desc") {
      orderBy = { price: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          variants: true,
          stocks: { select: { quantity: true } },
        },
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithStock = products.map((p) => ({
      ...p,
      stock: p.stocks.reduce((sum, s) => sum + s.quantity, 0),
      inStock: p.stocks.reduce((sum, s) => sum + s.quantity, 0) > 0,
    }));

    return {
      products: productsWithStock,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get product detail by ID or Slug
   */
  async getProductById(idOrSlug: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

    const product = await prisma.product.findFirst({
      where: {
        AND: [
          isUuid ? { id: idOrSlug } : { slug: idOrSlug },
          { deletedAt: null },
        ],
      },
      include: {
        category: true,
        brand: true,
        variants: true,
        stocks: {
          include: {
            warehouse: { select: { id: true, name: true, code: true } },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const totalStock = product.stocks.reduce((sum, s) => sum + s.quantity, 0);
    return { ...product, stock: totalStock, inStock: totalStock > 0 };
  }

  /**
   * Create a new product with optional variants
   */
  async createProduct(data: any) {
    const slug = data.slug || generateSlug(data.name);

    const existing = await prisma.product.findFirst({
      where: { slug, deletedAt: null },
    });

    if (existing) {
      throw new ConflictError("Product name or slug already exists");
    }

    // Verify category
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    // Verify brand
    if (data.brandId) {
      const brand = await prisma.brand.findUnique({
        where: { id: data.brandId },
      });
      if (!brand) {
        throw new NotFoundError("Brand not found");
      }
    }

    // Build creation query with variants
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        categoryId: data.categoryId,
        brandId: data.brandId,
        images: data.images,
        isActive: data.isActive,
        variants: {
          create: data.variants || [],
        },
      },
      include: {
        variants: true,
      },
    });

    return product;
  }

  /**
   * Update product properties
   */
  async updateProduct(id: string, data: any) {
    const product = await prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const updateData: any = { ...data };

    if (data.name && !data.slug) {
      updateData.slug = generateSlug(data.name);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        variants: true,
      },
    });

    return updated;
  }

  /**
   * Soft delete product
   */
  async deleteProduct(id: string) {
    const product = await prisma.product.findFirst({
      where: { id, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return null;
  }
}
export const productsService = new ProductsService();
