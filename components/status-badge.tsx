import type { OrderStatus } from "@/types";
import { statusLabel } from "@/lib/format";

const tones: Partial<Record<OrderStatus, string>> = {
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-rose-50 text-rose-700",
  pending: "bg-orange-50 text-orange-700",
  searching_driver: "bg-blue-50 text-blue-700",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${tones[status] ?? "bg-amber-50 text-amber-700"}`}>{statusLabel[status]}</span>;
}
