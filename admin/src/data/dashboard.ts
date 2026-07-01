export interface ChartDataPoint {
  name: string;
  value: number;
  orders?: number;
  sales?: number;
}

export interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: string; // 'order', 'product', 'system', 'user'
}

export const mockRevenueData: ChartDataPoint[] = [
  { name: "Jan", value: 45000 },
  { name: "Feb", value: 52000 },
  { name: "Mar", value: 49000 },
  { name: "Apr", value: 63000 },
  { name: "May", value: 58000 },
  { name: "Jun", value: 71000 },
  { name: "Jul", value: 85000 },
  { name: "Aug", value: 78000 },
  { name: "Sep", value: 92000 },
  { name: "Oct", value: 98000 },
  { name: "Nov", value: 110000 },
  { name: "Dec", value: 124580 },
];

export const mockSalesOrdersData = [
  { name: "Mon", sales: 12000, orders: 45 },
  { name: "Tue", sales: 15000, orders: 58 },
  { name: "Wed", sales: 9000, orders: 32 },
  { name: "Thu", sales: 18000, orders: 74 },
  { name: "Fri", sales: 22000, orders: 95 },
  { name: "Sat", sales: 14000, orders: 62 },
  { name: "Sun", sales: 19000, orders: 80 },
];

export const mockWarehouseDistribution = [
  { name: "SF Logistics Center", value: 45 }, // Capacity %
  { name: "NY East Hub", value: 78 },
  { name: "Chicago Midwest", value: 32 },
];

export const mockCategoryDistribution = [
  { name: "Audio", value: 48 },
  { name: "Wearables", value: 32 },
  { name: "Accessories", value: 64 },
  { name: "Electronics", value: 18 },
];

export const mockRecentOrders = [
  {
    id: "FN-847291",
    customer: "Alex Mercer",
    items: "Sequoia Headphones",
    total: 299.0,
    status: "Delivered",
    date: "2 mins ago",
  },
  {
    id: "FN-726481",
    customer: "Sarah Connor",
    items: "X-Buds Pro + Power Bank",
    total: 208.0,
    status: "Shipped",
    date: "1 hour ago",
  },
  {
    id: "FN-938204",
    customer: "Bruce Wayne",
    items: "Orizon VR Headset",
    total: 599.0,
    status: "Processing",
    date: "3 hours ago",
  },
  {
    id: "FN-482910",
    customer: "Clark Kent",
    items: "Tech Organizer Case",
    total: 45.0,
    status: "Pending",
    date: "5 hours ago",
  },
  {
    id: "FN-102948",
    customer: "Diana Prince",
    items: "Premium Keyboard",
    total: 189.0,
    status: "Cancelled",
    date: "1 day ago",
  },
];

export const mockLowStockProducts = [
  { id: "prod-4", name: "MagSafe Stand", stock: 4, warehouse: "SF Logistics" },
  { id: "prod-6", name: "USB-C Hub", stock: 2, warehouse: "NY East Hub" },
  { id: "prod-7", name: "Flow Power Bank", stock: 1, warehouse: "Chicago Hub" },
];

export const mockBestSellers = [
  { name: "Sequoia Inspiring Musico Pro", sales: 128, revenue: 38272 },
  { name: "FlowNexa Orizon VR Headset", sales: 94, revenue: 56306 },
  { name: "X-Buds Pro Wireless", sales: 86, revenue: 12814 },
];

export const mockActivityFeed: ActivityEvent[] = [
  {
    id: "act-1",
    title: "Order #FN-847291 placed",
    description: "Alex Mercer purchased Sequoia Inspiring Musico Pro ($299.00)",
    timestamp: "2 mins ago",
    type: "order",
  },
  {
    id: "act-2",
    title: "Stock Alert: Flow Power Bank",
    description: "Inventory dipped below critical threshold (1 left in Chicago)",
    timestamp: "12 mins ago",
    type: "system",
  },
  {
    id: "act-3",
    title: "Contact submission resolved",
    description: "Super Admin replied to support ticket regarding refund request #78",
    timestamp: "45 mins ago",
    type: "user",
  },
  {
    id: "act-4",
    title: "New lead registered",
    description: "Johnathan Doe added to pipeline from San Francisco area",
    timestamp: "2 hours ago",
    type: "user",
  },
];
