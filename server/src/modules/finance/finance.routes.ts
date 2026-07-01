import { Router } from "express";
import { financeController } from "./finance.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { rbacMiddleware } from "../../middleware/rbac.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { createExpenseSchema, createBankAccountSchema, settleBankAccountSchema } from "./finance.dto";
import { AdminRole } from "@prisma/client";

const router = Router();

// Apply auth and RBAC restrictions to all finance routes
router.use(authMiddleware);
router.use(rbacMiddleware([AdminRole.SUPER_ADMIN, AdminRole.MANAGEMENT_TEAM]));

router.get("/metrics", financeController.getMetrics);

// Expenses
router.get("/expenses", financeController.listExpenses);
router.post("/expenses", validateRequest(createExpenseSchema), financeController.createExpense);

// Bank Accounts
router.get("/bank-accounts", financeController.listAccounts);
router.post("/bank-accounts", validateRequest(createBankAccountSchema), financeController.createAccount);
router.patch("/bank-accounts/:id/settle", validateRequest(settleBankAccountSchema), financeController.settleAccount);

export default router;
