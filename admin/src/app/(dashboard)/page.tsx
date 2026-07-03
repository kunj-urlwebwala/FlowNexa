"use client";

import React, { useState, useEffect } from "react";
import StatCard from "@/components/shared/StatCard";
import ChartCard from "@/components/shared/ChartCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { api } from "@/lib/api";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,

} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DashboardStats {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    totalInventory: number;
    lowStockProducts: number;
    pendingOrders: number;
    monthlyRevenue: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    stock: number;
    price: number;
  }>;
  bestSellers: Array<{
    name: string;
    sold: number;
    revenue: number;
  }>;
  revenueChart: Array<{
    name: string;
    revenue: number;
    orders: number;
  }>;
}

export default function DashboardHome() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await api.get<DashboardStats>("/dashboard/stats");
        setData(result);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-flownexa-lime size-8" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
        Failed to load dashboard data.
      </div>
    );
  }

  const { stats, recentOrders, lowStockProducts, bestSellers, revenueChart } = data;

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col gap-1 text-left">
        <h1 className="text-2xl font-bold font-heading text-white">Control Center Dashboard</h1>
        <p className="text-xs text-muted-foreground">Real-time metrics, system health, inventory logbooks, and AI workflows.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} variant="highlighted" />
        <StatCard title="Total Orders" value={`${stats.totalOrders}`} icon={ShoppingCart} />
        <StatCard title="Total Products" value={`${stats.totalProducts}`} icon={Package} />
        <StatCard title="Active Customers" value={`${stats.totalCustomers}`} icon={Users} />
        <StatCard title="Total Inventory" value={`${stats.totalInventory.toLocaleString()}`} icon={Package} />
        <StatCard title="Low Stock Alerts" value={`${stats.lowStockProducts} Products`} icon={AlertTriangle} />
        <StatCard title="Pending Orders" value={`${stats.pendingOrders}`} icon={ShoppingCart} />
        <StatCard title="Monthly Revenue" value={`₹${stats.monthlyRevenue.toLocaleString()}`} icon={DollarSign} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Overview">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="revenue" stroke="#E1FF4B" fill="#E1FF4B" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Best Sellers">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestSellers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" fontSize={10} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px" }} />
              <Bar dataKey="sold" fill="#E1FF4B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
          <h3 className="font-heading font-bold text-sm text-white mb-4">Recent Orders</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-muted-foreground text-[10px]">Order</TableHead>
                <TableHead className="text-muted-foreground text-[10px]">Customer</TableHead>
                <TableHead className="text-muted-foreground text-[10px]">Total</TableHead>
                <TableHead className="text-muted-foreground text-[10px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="border-white/5 hover:bg-white/3">
                  <TableCell className="font-bold text-flownexa-lime text-xs">{order.orderNumber}</TableCell>
                  <TableCell className="text-xs text-white">{order.customer}</TableCell>
                  <TableCell className="text-xs text-white">₹{order.total.toFixed(2)}</TableCell>
                  <TableCell><StatusBadge status={order.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
          <h3 className="font-heading font-bold text-sm text-white mb-4">Low Stock Products</h3>
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-muted-foreground text-[10px]">Product</TableHead>
                <TableHead className="text-muted-foreground text-[10px]">Stock</TableHead>
                <TableHead className="text-muted-foreground text-[10px]">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-xs text-muted-foreground text-center py-8">
                    All products are well-stocked!
                  </TableCell>
                </TableRow>
              ) : (
                lowStockProducts.map((product) => (
                  <TableRow key={product.id} className="border-white/5 hover:bg-white/3">
                    <TableCell className="text-xs text-white font-medium">{product.name}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold ${product.stock === 0 ? "text-red-400" : "text-yellow-400"}`}>
                        {product.stock} units
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-white">₹{product.price.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
