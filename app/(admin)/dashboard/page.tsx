"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminOrder, DashboardMetrics } from "@/types/admin";
import { ErrorState, LoadingRows, PageTitle, StatusBadge, DetailLink } from "@/components/admin/admin-ui";

const labels: Record<keyof DashboardMetrics, string> = {
  total_users: "Total users", total_customers: "Customers", total_drivers: "Drivers", pending_drivers: "Driver pending",
  approved_drivers: "Driver approved", total_merchants: "Merchants", active_merchants: "Merchant aktif", total_orders: "Total orders",
  total_ride: "Ride", total_food: "Food", total_send: "Send", completed_orders: "Completed", cancelled_orders: "Cancelled",
  total_gmv: "GMV completed", total_paid_cash: "Cash terbayar", unpaid_completed_orders: "Completed belum dibayar",
};
const money = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default function DashboardPage() {
  const [data, setData] = useState<{ metrics: DashboardMetrics; recent_orders: AdminOrder[] }>();
  const [error, setError] = useState("");
  const load = useCallback(() => { apiRequest<{ metrics: DashboardMetrics; recent_orders: AdminOrder[] }>("/admin/dashboard").then(setData).catch((e) => setError(errorMessage(e))); }, []);
  useEffect(() => { void load(); }, [load]);
  return <><PageTitle title="Dashboard" description="Ringkasan operasional anterGo hari ini." />
    {error ? <ErrorState message={error} retry={load} /> : !data ? <LoadingRows /> : <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Object.entries(data.metrics).map(([key, value]) => <article key={key} className="admin-card"><p className="text-sm font-semibold text-slate-500">{labels[key as keyof DashboardMetrics]}</p><strong className="mt-2 block text-2xl text-slate-950">{key.includes("gmv") || key.includes("paid_cash") ? money.format(value) : value.toLocaleString("id-ID")}</strong></article>)}</section>
      <section className="admin-card mt-6"><h2 className="mb-4 text-lg font-black">Order terbaru</h2><div className="overflow-x-auto"><table className="admin-table"><thead><tr><th>Order</th><th>Tipe</th><th>Customer</th><th>Status</th><th>Total</th><th></th></tr></thead><tbody>{data.recent_orders.map((order) => <tr key={order.id}><td className="font-bold">{order.order_number}</td><td>{order.type}</td><td>{order.customer?.name ?? order.user?.name ?? "-"}</td><td><StatusBadge value={order.status} /></td><td>{money.format(Number(order.total_price))}</td><td><DetailLink href={`/orders/${order.id}`} /></td></tr>)}</tbody></table></div></section>
    </>}
  </>;
}

