"use client";

import React from "react";
import StatCard from "@/components/shared/StatCard";
import ChartCard from "@/components/shared/ChartCard";
import StatusBadge from "@/components/shared/StatusBadge";
import Timeline from "@/components/shared/Timeline";
import QuickActionCard from "@/components/shared/QuickActionCard";
import {
  mockRevenueData,
  mockSalesOrdersData,
  mockWarehouseDistribution,
  mockCategoryDistribution,
  mockRecentOrders,
  mockLowStockProducts,
  mockBestSellers,
  mockActivityFeed,
} from "@/data/dashboard";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  History,
  Activity,
  Plus,
  BookOpen,
  HelpCircle,
  FolderDot,
  FileCode,
  Zap,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardHome() {
  const COLORS = ["#E1FF4B", "#3B82F6", "#10B981", "#F59E0B"];

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Welcome Title Banner */}
      <div className="flex flex-col gap-1 text-left">
        <h1 className="text-2xl font-bold font-heading text-white">
          Control Center Dashboard
        </h1>
        <p className="text-xs text-muted-foreground">
          Real-time metrics, system health, inventory logbooks, and AI workflows.
        </p>
      </div>

      {/* Stats Row (8 Grid Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$124,580"
          icon={DollarSign}
          trend={{ value: 12.5, isUp: true }}
          variant="highlighted"
        />
        <StatCard
          title="Total Orders"
          value="1,247"
          icon={ShoppingCart}
          trend={{ value: 8.2, isUp: true }}
          progress={{ value: 68, label: "Fulfillment Rate" }}
        />
        <StatCard
          title="Total Products"
          value="384"
          icon={Package}
          progress={{ value: 88, label: "Active Listings" }}
        />
        <StatCard
          title="Active Customers"
          value="2,891"
          icon={Users}
          trend={{ value: 4.3, isUp: true }}
        />
        <StatCard
          title="Total Inventory"
          value="12,450"
          icon={Package}
          progress={{ value: 45, label: "Warehouse Space" }}
        />
        <StatCard
          title="Low Stock Alerts"
          value="3 Products"
          icon={AlertTriangle}
          trend={{ value: 1, isUp: false }}
        />
        <StatCard
          title="Pending Orders"
          value="47"
          icon={ShoppingCart}
          progress={{ value: 15, label: "Processing Queue" }}
        />
        <StatCard
          title="Monthly Sales"
          value="$18,420"
          icon={DollarSign}
          trend={{ value: 5.7, isUp: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Area Chart (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ChartCard title="Revenue Growth Timeline" subtitle="Gross billing volume represented monthly" onFilterChange={() => {}}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={mockRevenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E1FF4B" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#E1FF4B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1D26", borderColor: "#2A2F3E", color: "#FFF", borderRadius: "12px", fontSize: "11px" }}
                  formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#E1FF4B"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Dual Bar Chart (Sales vs Orders) */}
          <ChartCard title="Sales Volume & Order Counts" subtitle="Comparative analysis of recent transaction logs" onFilterChange={() => {}}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockSalesOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9CA3AF"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1D26", borderColor: "#2A2F3E", color: "#FFF", borderRadius: "12px", fontSize: "11px" }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
                <Bar
                  name="Sales Volume"
                  dataKey="sales"
                  fill="#E1FF4B"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
                <Bar
                  name="Orders Count (x100)"
                  dataKey="orders"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right side: Categories & Warehouse Capacity (1/3 width) */}
        <div className="flex flex-col gap-6">
          <ChartCard title="Warehouse Capacity distribution" subtitle="Current storage utilization across centers">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockWarehouseDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3E" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#9CA3AF"
                  fontSize={10}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#FFF"
                  fontSize={9}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1A1D26", borderColor: "#2A2F3E", color: "#FFF", borderRadius: "12px", fontSize: "11px" }}
                  formatter={(v) => [`${v}%`, "Occupied"]}
                />
                <Bar
                  dataKey="value"
                  fill="#E1FF4B"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Catalog Categories" subtitle="Product share count across classifications">
            <div className="flex flex-col items-center justify-center h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockCategoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {mockCategoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1A1D26", borderColor: "#2A2F3E", color: "#FFF", borderRadius: "12px", fontSize: "11px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend mapping */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
                {mockCategoryDistribution.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase">
                    <span className="size-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

      </div>

      {/* Tables & widgets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders table (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div className="flex flex-col text-left">
              <h3 className="font-heading font-bold text-sm text-white">
                Fulfillment Queue
              </h3>
              <p className="text-[10px] text-muted-foreground">
                Process or dispatch the latest transaction requests.
              </p>
            </div>
            <span className="text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-full text-muted-foreground font-bold uppercase">
              Recent Transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="hover:bg-transparent">
                <TableRow className="border-b border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Order ID</TableHead>
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Items</TableHead>
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Total</TableHead>
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentOrders.map((order) => (
                  <TableRow key={order.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <TableCell className="text-xs font-bold text-white">{order.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{order.customer}</TableCell>
                    <TableCell className="text-xs text-white max-w-[150px] truncate">{order.items}</TableCell>
                    <TableCell className="text-xs font-bold text-flownexa-lime">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="py-2.5">
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-[10px] text-muted-foreground font-medium">{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Quick actions panel & stock alerts (1/3 width) */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions Panel matching Make.com Sidebar Links look */}
          <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl flex flex-col gap-3">
            <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2 text-left">
              Quick Shortcuts
            </h3>
            <div className="flex flex-col gap-2.5">
              <QuickActionCard
                title="Launcher"
                description="Trigger automation scenarios, test triggers, or run scripts."
                href="/ai/calling"
                icon={Zap}
              />
              <QuickActionCard
                title="Media Library"
                description="Upload thumbnails, banners, invoices or blog illustrations."
                href="/content/media"
                icon={BookOpen}
              />
              <QuickActionCard
                title="CRM Pipeline"
                description="Manage customer feedback, area assignments, and leads."
                href="/crm/leads"
                icon={FolderDot}
              />
            </div>
          </div>

          {/* Low Stock Alerts widget */}
          <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl flex flex-col gap-3 text-left">
            <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">
              Critical Stock Alerts
            </h3>
            <div className="flex flex-col gap-3">
              {mockLowStockProducts.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-2.5 border border-white/5 rounded-xl bg-white/2">
                  <div>
                    <p className="text-xs font-bold text-white">{prod.name}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5">{prod.warehouse}</p>
                  </div>
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/20 font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                    {prod.stock} Left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Activity Timeline section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline (2/3 width) */}
        <div className="lg:col-span-2 bg-flownexa-surface border border-white/5 p-5 rounded-3xl">
          <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-3 text-left mb-4">
            System Operations Logbook
          </h3>
          <Timeline items={mockActivityFeed} />
        </div>

        {/* Best Sellers (1/3 width) */}
        <div className="bg-flownexa-surface border border-white/5 p-5 rounded-3xl text-left flex flex-col gap-4">
          <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">
            Top Performing Products
          </h3>
          <div className="flex flex-col gap-4">
            {mockBestSellers.map((seller, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white line-clamp-1 flex-1 pr-3">{seller.name}</span>
                  <span className="text-flownexa-lime shrink-0">${seller.revenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-muted-foreground font-semibold">
                  <span>Rank #{idx + 1}</span>
                  <span>{seller.sales} units sold</span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-flownexa-lime h-full rounded-full"
                    style={{ width: `${(seller.sales / 128) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
