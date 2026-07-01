import { prisma } from "../../config/database";
import { generateSlug } from "../../shared/utils/slug.util";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError";

export class CmsService {
  // ----------------------------------------------------
  // BLOG CATEGORIES
  // ----------------------------------------------------
  async listBlogCategories() {
    return prisma.blogCategory.findMany({ orderBy: { name: "asc" } });
  }

  async createBlogCategory(data: any) {
    const slug = data.slug || generateSlug(data.name);
    const existing = await prisma.blogCategory.findUnique({ where: { slug } });
    if (existing) throw new ConflictError("Blog folder category already exists");

    return prisma.blogCategory.create({
      data: { name: data.name, slug },
    });
  }

  // ----------------------------------------------------
  // BLOG POSTS
  // ----------------------------------------------------
  async listBlogPosts(query: { publishedOnly?: boolean }) {
    const where: any = {};
    if (query.publishedOnly) {
      where.isPublished = true;
    }
    return prisma.blogPost.findMany({
      where,
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async getBlogPost(idOrSlug: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const post = await prisma.blogPost.findFirst({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      include: { category: true },
    });

    if (!post) throw new NotFoundError("Blog article not found");
    return post;
  }

  async createBlogPost(data: any) {
    const slug = data.slug || generateSlug(data.title);
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) throw new ConflictError("Blog article slug title already exists");

    return prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        image: data.image,
        categoryId: data.categoryId,
        isPublished: data.isPublished,
      },
    });
  }

  async updateBlogPost(id: string, data: any) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundError("Blog article not found");

    const updateData: any = { ...data };
    if (data.title && !data.slug) {
      updateData.slug = generateSlug(data.title);
    }

    return prisma.blogPost.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteBlogPost(id: string) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundError("Blog article not found");

    await prisma.blogPost.delete({ where: { id } });
    return null;
  }

  // ----------------------------------------------------
  // TESTIMONIALS
  // ----------------------------------------------------
  async listTestimonials() {
    return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  }

  async createTestimonial(data: any) {
    return prisma.testimonial.create({ data });
  }

  async deleteTestimonial(id: string) {
    await prisma.testimonial.delete({ where: { id } });
    return null;
  }

  // ----------------------------------------------------
  // FAQ SETUP
  // ----------------------------------------------------
  async listFaqs() {
    return prisma.fAQ.findMany({ orderBy: { category: "asc" } });
  }

  async createFaq(data: any) {
    return prisma.fAQ.create({ data });
  }

  async deleteFaq(id: string) {
    await prisma.fAQ.delete({ where: { id } });
    return null;
  }

  // ----------------------------------------------------
  // DYNAMIC PAGES
  // ----------------------------------------------------
  async listPages() {
    return prisma.websitePage.findMany({ orderBy: { title: "asc" } });
  }

  async getPageBySlug(slug: string) {
    const page = await prisma.websitePage.findUnique({ where: { slug } });
    if (!page) throw new NotFoundError("Dynamic CMS page not found");
    return page;
  }

  async createPage(data: any) {
    const slug = data.slug || generateSlug(data.title);
    const existing = await prisma.websitePage.findUnique({ where: { slug } });
    if (existing) throw new ConflictError("Page slug URL already exists");

    return prisma.websitePage.create({
      data: { title: data.title, slug, content: data.content, isActive: data.isActive },
    });
  }

  async updatePage(id: string, data: any) {
    return prisma.websitePage.update({ where: { id }, data });
  }

  async deletePage(id: string) {
    await prisma.websitePage.delete({ where: { id } });
    return null;
  }

  // ----------------------------------------------------
  // SEO METADATA
  // ----------------------------------------------------
  async listSeoConfigs() {
    return prisma.sEOMetadata.findMany();
  }

  async createSeoConfig(data: any) {
    const existing = await prisma.sEOMetadata.findUnique({ where: { pageName: data.pageName } });
    if (existing) throw new ConflictError("SEO configuration already registered for page");

    return prisma.sEOMetadata.create({ data });
  }

  // ----------------------------------------------------
  // BANNERS SLIDES
  // ----------------------------------------------------
  async listBanners() {
    return prisma.banner.findMany({ orderBy: { order: "asc" } });
  }

  async createBanner(data: any) {
    return prisma.banner.create({ data });
  }

  async deleteBanner(id: string) {
    await prisma.banner.delete({ where: { id } });
    return null;
  }

  // ----------------------------------------------------
  // GLOBAL SETTINGS
  // ----------------------------------------------------
  async getSettings(key: string) {
    return prisma.websiteSettings.findUnique({ where: { key } });
  }

  async saveSettings(key: string, value: any) {
    return prisma.websiteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
export const cmsService = new CmsService();
