import { Request, Response, NextFunction } from "express";
import { productsService } from "./products.service";
import { successResponse } from "../../shared/utils/response.util";

export class ProductsController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, category, brand, minPrice, maxPrice, sortBy } = req.query as any;
      const result = await productsService.listProducts({
        page,
        limit,
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        sortBy,
      });
      successResponse(res, "Products listed successfully", result.products, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.getProductById(req.params.id as string);
      successResponse(res, "Product details retrieved successfully", product);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.createProduct(req.body);
      successResponse(res, "Product created successfully", product, 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await productsService.updateProduct(req.params.id as string, req.body);
      successResponse(res, "Product updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productsService.deleteProduct(req.params.id as string);
      successResponse(res, "Product deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}
export const productsController = new ProductsController();
