import { Request, Response, NextFunction } from "express";
import { categoriesService } from "./categories.service";
import { successResponse } from "../../shared/utils/response.util";

export class CategoriesController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parentOnly = req.query.parentOnly === "true";
      const categories = await categoriesService.listCategories({ parentOnly });
      successResponse(res, "Categories listed successfully", categories);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.getCategoryById(req.params.id as string);
      successResponse(res, "Category details retrieved successfully", category);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.createCategory(req.body);
      successResponse(res, "Category created successfully", category, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await categoriesService.updateCategory(req.params.id as string, req.body);
      successResponse(res, "Category updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoriesService.deleteCategory(req.params.id as string);
      successResponse(res, "Category deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}
export const categoriesController = new CategoriesController();
