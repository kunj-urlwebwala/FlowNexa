import { Request, Response, NextFunction } from "express";
import { financeService } from "./finance.service";
import { successResponse } from "../../shared/utils/response.util";

export class FinanceController {
  async getMetrics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const metrics = await financeService.getBalanceMetrics();
      successResponse(res, "Financial metrics calculated successfully", metrics);
    } catch (error) {
      next(error);
    }
  }

  // Expenses
  async listExpenses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await financeService.listExpenses(page, limit);
      successResponse(res, "Expenses listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async createExpense(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const expense = await financeService.createExpense(req.body);
      successResponse(res, "Expense logged successfully", expense, 201);
    } catch (error) {
      next(error);
    }
  }

  // Bank Accounts
  async listAccounts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await financeService.listBankAccounts(page, limit);
      successResponse(res, "Bank accounts listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async createAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const account = await financeService.createBankAccount(req.body);
      successResponse(res, "Bank account registered successfully", account, 201);
    } catch (error) {
      next(error);
    }
  }

  async settleAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await financeService.updateAccountSettlement(
        req.params.id as string,
        req.body.isSettled
      );
      successResponse(res, "Bank account settlement status updated", updated);
    } catch (error) {
      next(error);
    }
  }
}
export const financeController = new FinanceController();
