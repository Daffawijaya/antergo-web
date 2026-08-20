import Link from "next/link";
import { Bike, Store } from "lucide-react";
import type { Order } from "@/types";
import { currency, shortDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";

export function OrderCard({ order }: { order: Order }) {
  const Icon = order.type === "food" ? Store : Bike;
  return (
    <Link href={`/orders/${order.id}`} className="card block transition hover:border-amber-200">
      <div className="flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Icon size={21} /></div><div className="min-w-0 flex-1"><div className="mb-1 flex items-start justify-between gap-2"><div><p className="font-bold">{order.type === "food" ? order.merchant?.name ?? "Pesanan UMKM" : "anterGo Ride"}</p><p className="text-xs text-slate-400">{shortDate(order.created_at)}</p></div><StatusBadge status={order.status} /></div><p className="mt-3 truncate text-sm text-slate-500">{order.destination_address}</p><p className="mt-1 font-extrabold">{currency(order.total_price)}</p></div></div>
    </Link>
  );
}
