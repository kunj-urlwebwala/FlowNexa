import { AdminProductRecord, mockAdminProducts } from "./admin-products";

export interface OrderRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    product: AdminProductRecord;
    quantity: number;
    color?: string;
  }[];
  total: number;
  subtotal: number;
  shipping: number;
  status: string;
  paymentMethod: string;
  shippingMethod: string;
  createdDate: string;
  warehouse: string;
  timeline: {
    title: string;
    timestamp: string;
    isCompleted: boolean;
    description?: string;
  }[];
}

export const mockOrders: OrderRecord[] = [
  {
    id: "FN-847291",
    customerName: "Alex Mercer",
    customerEmail: "alex@mercer.com",
    customerPhone: "+1 (555) 019-2834",
    items: [
      {
        product: mockAdminProducts[0], // Sequoia Headphones
        quantity: 1,
        color: "Royal Blue",
      },
    ],
    total: 299.0,
    subtotal: 299.0,
    shipping: 0,
    status: "Delivered",
    paymentMethod: "Credit Card",
    shippingMethod: "Express Shipping",
    createdDate: "June 25, 2026",
    warehouse: "SF Logistics Center",
    timeline: [
      { title: "Order Placed", timestamp: "June 25, 10:14 AM", isCompleted: true, description: "Payment authenticated via Stripe" },
      { title: "Order Confirmed", timestamp: "June 25, 10:30 AM", isCompleted: true, description: "Inventory allocated at SF Warehouse" },
      { title: "Order Packed & Dispatched", timestamp: "June 25, 12:45 PM", isCompleted: true, description: "Carrier partner: DHL Express" },
      { title: "Out for Delivery", timestamp: "June 26, 09:00 AM", isCompleted: true, description: "Courier on route with parcel" },
      { title: "Delivered", timestamp: "June 26, 02:30 PM", isCompleted: true, description: "Package signed by recipient" },
    ],
  },
  {
    id: "FN-726481",
    customerName: "Sarah Connor",
    customerEmail: "sarah@connor.com",
    customerPhone: "+1 (555) 014-9982",
    items: [
      {
        product: mockAdminProducts[2], // X-Buds Pro
        quantity: 1,
        color: "Neon Lime",
      },
      {
        product: mockAdminProducts[4], // Mechanical Keyboard
        quantity: 1,
        color: "Lime Swapped",
      },
    ],
    total: 338.0,
    subtotal: 338.0,
    shipping: 0,
    status: "Shipped",
    paymentMethod: "Cash on Delivery",
    shippingMethod: "Standard Shipping",
    createdDate: "June 29, 2026",
    warehouse: "NY East Hub",
    timeline: [
      { title: "Order Placed", timestamp: "June 29, 03:00 PM", isCompleted: true, description: "COD agreement confirmed" },
      { title: "Order Confirmed", timestamp: "June 29, 04:00 PM", isCompleted: true, description: "Inventory allocated at NY Hub" },
      { title: "Order Packed & Dispatched", timestamp: "June 30, 08:30 AM", isCompleted: true, description: "Carrier partner: FedEx Ground" },
      { title: "Out for Delivery", timestamp: "Pending", isCompleted: false },
      { title: "Delivered", timestamp: "Pending", isCompleted: false },
    ],
  },
  {
    id: "FN-938204",
    customerName: "Bruce Wayne",
    customerEmail: "bruce@wayne.com",
    customerPhone: "+1 (555) 999-0000",
    items: [
      {
        product: mockAdminProducts[1], // Orizon VR
        quantity: 1,
        color: "Glacier White",
      },
    ],
    total: 599.0,
    subtotal: 599.0,
    shipping: 0,
    status: "Processing",
    paymentMethod: "Credit Card",
    shippingMethod: "Express Shipping",
    createdDate: "June 29, 2026",
    warehouse: "SF Logistics Center",
    timeline: [
      { title: "Order Placed", timestamp: "June 29, 08:00 PM", isCompleted: true, description: "Secure card checkout completed" },
      { title: "Order Confirmed", timestamp: "June 30, 09:00 AM", isCompleted: true, description: "Order routed to SF Logistics Center" },
      { title: "Order Packed & Dispatched", timestamp: "Pending", isCompleted: false },
      { title: "Out for Delivery", timestamp: "Pending", isCompleted: false },
      { title: "Delivered", timestamp: "Pending", isCompleted: false },
    ],
  },
];
