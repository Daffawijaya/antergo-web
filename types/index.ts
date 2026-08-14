export type UserRole = "customer" | "driver" | "merchant" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
  avatar: string | null;
  is_active: boolean;
}

export interface Product {
  id: number;
  merchant_id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  image: string | null;
  is_available: boolean;
  merchant?: Merchant;
}

export interface Merchant {
  id: number;
  name: string;
  description: string | null;
  phone: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  logo: string | null;
  is_open: boolean;
  is_active: boolean;
  category?: { id: number; name: string; slug: string } | null;
  products?: Product[];
}

export type OrderType = "ride" | "send" | "food";
export type OrderStatus =
  | "pending"
  | "searching_driver"
  | "driver_assigned"
  | "driver_arriving"
  | "driver_arrived"
  | "merchant_confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "picked_up"
  | "in_progress"
  | "delivering"
  | "completed"
  | "cancelled";

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface OrderStatusHistory {
  id: number;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  type: OrderType;
  status: OrderStatus;
  pickup_address: string;
  destination_address: string;
  distance: string | null;
  subtotal: string;
  delivery_fee: string;
  service_fee: string;
  total_price: string;
  payment_method: string;
  payment_status: string;
  notes: string | null;
  cancelled_reason: string | null;
  created_at: string;
  completed_at: string | null;
  merchant?: Merchant | null;
  items?: OrderItem[];
  status_histories?: OrderStatusHistory[];
  driver?: {
    id: number;
    user?: User;
    vehicle?: { brand: string; model: string | null; plate_number: string };
  } | null;
}

export interface Paginated<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface LaravelErrorPayload {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

