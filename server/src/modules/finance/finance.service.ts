import { prisma } from "../../config/database";
import { NotFoundError } from "../../shared/errors/AppError";

export class FinanceService {
  // ----------------------------------------------------
  // BALANCE METRICS
  // ----------------------------------------------------

  async getBalanceMetrics() {
    // 1. Calculate Gross Revenue (sum of all PAID orders)
    const paidOrders = await prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    });
    const grossRevenue = paidOrders._sum.total || 0.0;

    // 2. Calculate Total Expenses
    const expenses = await prisma.expense.aggregate({
      _sum: { amount: true },
    });
    const totalExpenses = expenses._sum.amount || 0.0;

    // 3. Calculate Total Refunds
    const refunds = await prisma.refund.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });
    const totalRefunds = refunds._sum.amount || 0.0;

    // 4. Net Balance
    const netBalance = grossRevenue - totalExpenses - totalRefunds;

    return {
      grossRevenue,
      totalExpenses,
      totalRefunds,
      netBalance,
    };
  }

  // ----------------------------------------------------
  // EXPENSES CRUD
  // ----------------------------------------------------

  async listExpenses(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.expense.findMany({
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.expense.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createExpense(data: any) {
    return prisma.expense.create({
      data: {
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: data.date,
      },
    });
  }

  // ----------------------------------------------------
  // BANK ACCOUNTS CRUD
  // ----------------------------------------------------

  async listBankAccounts(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.bankAccount.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.bankAccount.count(),
    ]);
    return { items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async createBankAccount(data: any) {
    return prisma.bankAccount.create({
      data: {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber,
        type: data.type,
      },
    });
  }

  async updateAccountSettlement(id: string, isSettled: boolean) {
    const account = await prisma.bankAccount.findUnique({ where: { id } });
    if (!account) throw new NotFoundError("Bank account not found");

    return prisma.bankAccount.update({
      where: { id },
      data: { isSettled },
    });
  }
}
export const financeService = new FinanceService();
