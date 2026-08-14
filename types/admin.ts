import type { Merchant, Order, Paginated, User, UserRole } from "@/types";

export interface AdminUser extends Omit<User, "roles"> {
  roles: UserRole[];
  orders_count?: number;
  driver?: AdminDriver | null;
  merchant?: AdminMerchant | null;
}

export interface AdminDriver {
  id: number;
  user_id: number;
  nik: string;
  license_number: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  is_online: boolean;
  rating: string;
  total_completed_orders: number;
  user: AdminUser;
  vehicle?: { type: string; brand: string; model: string | null; plate_number: string; color: string | null } | null;
  location?: { latitude: string; longitude: string; updated_at: string } | null;
}

export interface AdminMerchant extends Merchant {
  user: AdminUser;
  products_count?: number;
  orders_count?: number;
}

export interface AdminOrder extends Omit<Order, "driver" | "merchant"> {
  customer?: AdminUser;
  user?: AdminUser;
  driver?: (AdminDriver & { user: AdminUser }) | null;
  merchant?: AdminMerchant | null;
  payment?: { method: string; status: string; amount: string; transaction_id: string | null; paid_at: string | null } | null;
  rating?: { rating: number; comment: string | null } | null;
  send_details?: { item_name: string | null; item_description: string | null; recipient_name: string | null; recipient_phone: string | null } | null;
}

export interface DashboardMetrics {
  total_users: number; total_customers: number; total_drivers: number; pending_drivers: number;
  approved_drivers: number; total_merchants: number; active_merchants: number; total_orders: number;
  total_ride: number; total_food: number; total_send: number; completed_orders: number;
  cancelled_orders: number; total_gmv: number; total_paid_cash: number; unpaid_completed_orders: number;
}

export type AdminPaginator<T> = Paginated<T>;

