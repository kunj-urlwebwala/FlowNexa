import { Router } from "express";
import { cmsController } from "./cms.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import {
  createBlogCategorySchema,
  createBlogPostSchema,
  updateBlogPostSchema,
  createTestimonialSchema,
  createFaqSchema,
  createPageSchema,
  createSeoSchema,
  createBannerSchema,
} from "./cms.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Public Storefront Read Endpoints
router.get("/blogs/folders", cmsController.listBlogCategories);
router.get("/blogs", cmsController.listBlogPosts);
router.get("/blogs/:id", cmsController.getBlogPost);
router.get("/testimonials", cmsController.listTestimonials);
router.get("/faqs", cmsController.listFaqs);
router.get("/pages", cmsController.listPages);
router.get("/pages/:slug", cmsController.getPage);
router.get("/banners", cmsController.listBanners);
router.get("/settings/:key", cmsController.getSettings);

// Protected Admin Edit Endpoints
router.use(authMiddleware);
router.use(rbacMiddleware([AdminRole.SUPER_ADMIN, AdminRole.MANAGEMENT_TEAM]));

// Blog management
router.post("/blogs/folders", validateRequest(createBlogCategorySchema), cmsController.createBlogCategory);
router.post("/blogs", validateRequest(createBlogPostSchema), cmsController.createBlogPost);
router.patch("/blogs/:id", validateRequest(updateBlogPostSchema), cmsController.updateBlogPost);
router.delete("/blogs/:id", cmsController.deleteBlogPost);

// Testimonials management
router.post("/testimonials", validateRequest(createTestimonialSchema), cmsController.createTestimonial);
router.delete("/testimonials/:id", cmsController.deleteTestimonial);

// FAQs management
router.post("/faqs", validateRequest(createFaqSchema), cmsController.createFaq);
router.delete("/faqs/:id", cmsController.deleteFaq);

// Pages management
router.post("/pages", validateRequest(createPageSchema), cmsController.createPage);
router.patch("/pages/:id", cmsController.updatePage);
router.delete("/pages/:id", cmsController.deletePage);

// SEO management
router.get("/seo", cmsController.listSeo);
router.post("/seo", validateRequest(createSeoSchema), cmsController.createSeo);

// Banners management
router.post("/banners", validateRequest(createBannerSchema), cmsController.createBanner);
router.delete("/banners/:id", cmsController.deleteBanner);

// Global settings
router.post("/settings/:key", cmsController.saveSettings);

export default router;
