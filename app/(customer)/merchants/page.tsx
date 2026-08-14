"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminMerchant, AdminPaginator } from "@/types/admin";
import { DetailLink, EmptyState, ErrorState, LoadingRows, PageTitle, Pagination, StatusBadge } from "@/components/admin/admin-ui";

export default function MerchantsPage() {
  const [data, setData] = useState<AdminPaginator<AdminMerchant>>(); const [search, setSearch] = useState(""); const [active, setActive] = useState(""); const [page, setPage] = useState(1); const [error, setError] = useState("");
  const load = useCallback(() => { const q = new URLSearchParams({ page: String(page) }); if (search) q.set("search", search); if (active) q.set("active", active); apiRequest<AdminPaginator<AdminMerchant>>(`/admin/merchants?${q}`).then(setData).catch((e) => setError(errorMessage(e))); }, [active, page, search]); useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  const toggle = async (merchant: AdminMerchant) => { if (!confirm(`${merchant.is_active ? "Nonaktifkan" : "Aktifkan"} ${merchant.name}?`)) return; try { await apiRequest(`/admin/merchants/${merchant.id}/status`, { method: "PATCH", body: JSON.stringify({ is_active: !merchant.is_active }) }); alert("Perubahan berhasil disimpan."); load(); } catch (e) { setError(errorMessage(e)); } };
  return <><PageTitle title="Merchants" description="Kontrol operasional merchant dan katalog." action={<div className="flex gap-2"><input className="admin-input" placeholder="Cari merchant" value={search} onChange={(e) => setSearch(e.target.value)} /><select className="admin-input" value={active} onChange={(e) => setActive(e.target.value)}><option value="">Semua</option><option value="1">Aktif</option><option value="0">Nonaktif</option></select></div>} />{error ? <ErrorState message={error} /> : !data ? <LoadingRows /> : !data.data.length ? <EmptyState /> : <div className="admin-card overflow-x-auto"><table className="admin-table"><thead><tr><th>Merchant</th><th>Kategori</th><th>Status</th><th>Buka</th><th>Produk</th><th>Orders</th><th>Aksi</th><th></th></tr></thead><tbody>{data.data.map((m) => <tr key={m.id}><td><strong>{m.name}</strong><small>{m.user?.email}</small></td><td>{m.category?.name ?? "-"}</td><td><StatusBadge value={m.is_active ? "active" : "inactive"} /></td><td><StatusBadge value={m.is_open ? "open" : "closed"} /></td><td>{m.products_count ?? 0}</td><td>{m.orders_count ?? 0}</td><td><button className={m.is_active ? "admin-btn-danger" : "admin-btn-primary"} onClick={() => void toggle(m)}>{m.is_active ? "Deactivate" : "Activate"}</button></td><td><DetailLink href={`/merchants/${m.id}`} /></td></tr>)}</tbody></table><Pagination page={data.current_page} lastPage={data.last_page} onPage={setPage} /></div>}</>;
}


