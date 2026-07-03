import { Request, Response, NextFunction } from "express";
import { brandsService } from "./brands.service";
import { successResponse } from "../../shared/utils/response.util";

export class BrandsController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await brandsService.listBrands(page, limit);
      successResponse(res, "Brands listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brand = await brandsService.getBrandById(req.params.id as string);
      successResponse(res, "Brand details retrieved successfully", brand);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brand = await brandsService.createBrand(req.body);
      successResponse(res, "Brand created successfully", brand, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await brandsService.updateBrand(req.params.id as string, req.body);
      successResponse(res, "Brand updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await brandsService.deleteBrand(req.params.id as string);
      successResponse(res, "Brand deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}
export const brandsController = new BrandsController();
