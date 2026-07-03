import { prisma } from "../../config/database";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export class DashboardService {
  async getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      totalInventory,
      lowStockProducts,
      pendingOrders,
      monthlyRevenue,
      recentOrders,
      lowStockList,
      bestSellers,
    ] = await Promise.all([
      // Total Revenue (all delivered orders)
      prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { total: true },
      }),

      // Total Orders
      prisma.order.count(),

      // Total Products (active)
      prisma.product.count({ where: { deletedAt: null, isActive: true } }),

      // Total Customers
      prisma.user.count({ where: { deletedAt: null } }),

      // Total Inventory (sum of all stock)
      prisma.inventoryStock.aggregate({
        _sum: { quantity: true },
      }),

      // Low Stock Products (stock < 10)
      prisma.product.count({
        where: {
          deletedAt: null,
          isActive: true,
          stocks: { some: { quantity: { lt: 10 } } },
        },
      }),

      // Pending Orders
      prisma.order.count({
        where: { status: OrderStatus.PENDING },
      }),

      // Monthly Revenue (last 30 days)
      prisma.order.aggregate({
        where: {
          status: OrderStatus.DELIVERED,
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { total: true },
      }),

      // Recent Orders (last 5)
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
        },
      }),

      // Low Stock Products List (from InventoryStock)
      prisma.product.findMany({
        where: {
          deletedAt: null,
          isActive: true,
          stocks: { some: { quantity: { lt: 10 } } },
        },
        select: {
          id: true,
          name: true,
          price: true,
          stocks: { select: { quantity: true } },
        },
        take: 5,
      }),

      // Best Sellers (top 5 by order count)
      prisma.orderItem.groupBy({
        by: ["productName"],
        _count: { id: true },
        _sum: { price: true, quantity: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    // Revenue trend (last 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailyOrders = await prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      _count: { id: true },
      _sum: { total: true },
    });

    // Format revenue chart data
    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });
      revenueData.push({
        name: dayName,
        revenue: 0,
        orders: 0,
      });
    }

    return {
      stats: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders: totalOrders,
        totalProducts: totalProducts,
        totalCustomers: totalCustomers,
        totalInventory: totalInventory._sum.quantity || 0,
        lowStockProducts: lowStockProducts,
        pendingOrders: pendingOrders,
        monthlyRevenue: monthlyRevenue._sum.total || 0,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.user?.name || "Unknown",
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      })),
      lowStockProducts: lowStockList,
      bestSellers: bestSellers.map((item) => ({
        name: item.productName,
        sold: item._count.id,
        revenue: item._sum.price || 0,
      })),
      revenueChart: revenueData,
    };
  }
}

export const dashboardService = new DashboardService();
