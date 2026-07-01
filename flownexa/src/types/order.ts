import { Product } from "./product";
import { Address } from "./user";

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  trackingNumber?: string;
}
