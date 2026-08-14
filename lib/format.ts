import type { OrderStatus } from "@/types";

export function currency(value: string | number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function shortDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export const statusLabel: Record<OrderStatus, string> = {
  pending: "Menunggu merchant",
  searching_driver: "Mencari driver",
  driver_assigned: "Driver ditemukan",
  driver_arriving: "Driver menuju lokasi",
  driver_arrived: "Driver tiba",
  merchant_confirmed: "Dikonfirmasi",
  preparing: "Sedang disiapkan",
  ready_for_pickup: "Siap diambil",
  picked_up: "Sudah diambil",
  in_progress: "Dalam perjalanan",
  delivering: "Sedang diantar",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};
