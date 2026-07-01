import { prisma } from "../../config/database";
import { generateSlug } from "../../shared/utils/slug.util";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class BrandsService {
  async listBrands() {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return brands;
  }

  async getBrandById(id: string) {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundError("Brand not found");
    }

    return brand;
  }

  async createBrand(data: any) {
    const slug = data.slug || generateSlug(data.name);

    const existing = await prisma.brand.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictError("Brand name or slug already exists");
    }

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug,
        logo: data.logo,
        description: data.description,
      },
    });

    return brand;
  }

  async updateBrand(id: string, data: any) {
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundError("Brand not found");
    }

    const updateData: any = { ...data };

    if (data.name && !data.slug) {
      updateData.slug = generateSlug(data.name);
    }

    const updated = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  async deleteBrand(id: string) {
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!brand) {
      throw new NotFoundError("Brand not found");
    }

    if (brand._count.products > 0) {
      throw new ConflictError("Cannot delete brand with linked products");
    }

    await prisma.brand.delete({
      where: { id },
    });

    return null;
  }
}
export const brandsService = new BrandsService();
