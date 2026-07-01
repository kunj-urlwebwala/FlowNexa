import { Request, Response, NextFunction } from "express";
import { cmsService } from "./cms.service";
import { successResponse } from "../../shared/utils/response.util";

export class CmsController {
  // Blog Categories
  async listBlogCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await cmsService.listBlogCategories();
      successResponse(res, "Blog categories listed successfully", list);
    } catch (error) {
      next(error);
    }
  }

  async createBlogCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await cmsService.createBlogCategory(req.body);
      successResponse(res, "Blog folder created successfully", category, 201);
    } catch (error) {
      next(error);
    }
  }

  // Blog Posts
  async listBlogPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const publishedOnly = req.query.publishedOnly === "true";
      const posts = await cmsService.listBlogPosts({ publishedOnly });
      successResponse(res, "Blog articles listed successfully", posts);
    } catch (error) {
      next(error);
    }
  }

  async getBlogPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await cmsService.getBlogPost(req.params.id as string);
      successResponse(res, "Blog article retrieved successfully", post);
    } catch (error) {
      next(error);
    }
  }

  async createBlogPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await cmsService.createBlogPost(req.body);
      successResponse(res, "Blog article created successfully", post, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateBlogPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await cmsService.updateBlogPost(req.params.id as string, req.body);
      successResponse(res, "Blog article updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteBlogPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await cmsService.deleteBlogPost(req.params.id as string);
      successResponse(res, "Blog article deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // Testimonials
  async listTestimonials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await cmsService.listTestimonials();
      successResponse(res, "Testimonials listed successfully", list);
    } catch (error) {
      next(error);
    }
  }

  async createTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const testimonial = await cmsService.createTestimonial(req.body);
      successResponse(res, "Testimonial added successfully", testimonial, 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteTestimonial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await cmsService.deleteTestimonial(req.params.id as string);
      successResponse(res, "Testimonial removed successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // FAQs
  async listFaqs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faqs = await cmsService.listFaqs();
      successResponse(res, "FAQs listed successfully", faqs);
    } catch (error) {
      next(error);
    }
  }

  async createFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const faq = await cmsService.createFaq(req.body);
      successResponse(res, "FAQ setup successfully", faq, 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await cmsService.deleteFaq(req.params.id as string);
      successResponse(res, "FAQ deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // Dynamic Pages
  async listPages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pages = await cmsService.listPages();
      successResponse(res, "Dynamic pages listed successfully", pages);
    } catch (error) {
      next(error);
    }
  }

  async getPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = await cmsService.getPageBySlug(req.params.slug as string);
      successResponse(res, "Dynamic page retrieved successfully", page);
    } catch (error) {
      next(error);
    }
  }

  async createPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = await cmsService.createPage(req.body);
      successResponse(res, "Dynamic page created successfully", page, 201);
    } catch (error) {
      next(error);
    }
  }

  async updatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await cmsService.updatePage(req.params.id as string, req.body);
      successResponse(res, "Dynamic page updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async deletePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await cmsService.deletePage(req.params.id as string);
      successResponse(res, "Dynamic page deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // SEO
  async listSeo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const configs = await cmsService.listSeoConfigs();
      successResponse(res, "SEO configurations listed successfully", configs);
    } catch (error) {
      next(error);
    }
  }

  async createSeo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await cmsService.createSeoConfig(req.body);
      successResponse(res, "SEO metadata configured successfully", config, 201);
    } catch (error) {
      next(error);
    }
  }

  // Banners
  async listBanners(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banners = await cmsService.listBanners();
      successResponse(res, "Slideshow banners listed successfully", banners);
    } catch (error) {
      next(error);
    }
  }

  async createBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const banner = await cmsService.createBanner(req.body);
      successResponse(res, "Slideshow banner added successfully", banner, 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteBanner(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await cmsService.deleteBanner(req.params.id as string);
      successResponse(res, "Slideshow banner removed successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // Global Settings
  async getSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await cmsService.getSettings(req.params.key as string);
      successResponse(res, "Global configuration retrieved", settings);
    } catch (error) {
      next(error);
    }
  }

  async saveSettings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await cmsService.saveSettings(req.params.key as string, req.body);
      successResponse(res, "Global configuration updated successfully", settings);
    } catch (error) {
      next(error);
    }
  }
}
export const cmsController = new CmsController();
