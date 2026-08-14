"use client";

import { use, useEffect, useState } from "react";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminMerchant } from "@/types/admin";
import { ErrorState, LoadingRows, PageTitle, StatusBadge } from "@/components/admin/admin-ui";

export default function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const [merchant, setMerchant] = useState<AdminMerchant>(); const [error, setError] = useState(""); useEffect(() => { apiRequest<{ merchant: AdminMerchant }>(`/admin/merchants/${id}`).then((r) => setMerchant(r.merchant)).catch((e) => setError(errorMessage(e))); }, [id]);
  return <><PageTitle title="Detail merchant" description="Profile operasional dan katalog produk." />{error ? <ErrorState message={error} /> : !merchant ? <LoadingRows /> : <div className="grid gap-5 lg:grid-cols-2"><section className="admin-card space-y-2"><h2 className="text-xl font-black">{merchant.name}</h2><p>{merchant.user?.name} · {merchant.user?.email}</p><p>{merchant.phone}</p><p>{merchant.address}</p><div className="flex gap-2"><StatusBadge value={merchant.is_active ? "active" : "inactive"} /><StatusBadge value={merchant.is_open ? "open" : "closed"} /></div><p>{merchant.orders_count ?? 0} orders</p></section><section className="admin-card"><h2 className="mb-3 font-black">Produk ({merchant.products?.length ?? 0})</h2><div className="space-y-2">{merchant.products?.map((p) => <div className="rounded-xl bg-slate-50 p-3" key={p.id}><strong>{p.name}</strong><p className="text-sm text-slate-500">Stok {p.stock} · Rp {Number(p.price).toLocaleString("id-ID")}</p></div>)}</div></section></div>}</>;
}
