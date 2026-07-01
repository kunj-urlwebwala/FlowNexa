import { prisma } from "../../config/database";
import { generateSlug } from "../../shared/utils/slug.util";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class CategoriesService {
  /**
   * List categories (roots or all nested)
   */
  async listCategories(query: { parentOnly?: boolean }) {
    const where: any = {};
    if (query.parentOnly) {
      where.parentId = null;
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        subCategories: true,
        parent: {
          select: { id: true, name: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories;
  }

  /**
   * Get category details
   */
  async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
        parent: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  /**
   * Create new category
   */
  async createCategory(data: any) {
    const slug = data.slug || generateSlug(data.name);

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictError("Category name or slug already exists");
    }

    // Verify parent if parentId is provided
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) {
        throw new NotFoundError("Parent category not found");
      }
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        image: data.image,
        parentId: data.parentId,
      },
    });

    return category;
  }

  /**
   * Update category
   */
  async updateCategory(id: string, data: any) {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    const updateData: any = { ...data };

    if (data.name && !data.slug) {
      updateData.slug = generateSlug(data.name);
    }

    if (data.parentId) {
      if (data.parentId === id) {
        throw new ConflictError("Category cannot be its own parent");
      }
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) {
        throw new NotFoundError("Parent category not found");
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  /**
   * Delete category
   */
  async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        subCategories: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (category.subCategories.length > 0) {
      throw new ConflictError("Cannot delete category with active subcategories");
    }

    if (category._count.products > 0) {
      throw new ConflictError("Cannot delete category with linked products");
    }

    await prisma.category.delete({
      where: { id },
    });

    return null;
  }
}
export const categoriesService = new CategoriesService();
