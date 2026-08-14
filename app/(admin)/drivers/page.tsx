"use client";

import { useCallback, useEffect, useState } from "react";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminDriver, AdminPaginator } from "@/types/admin";
import { DetailLink, EmptyState, ErrorState, LoadingRows, PageTitle, Pagination, StatusBadge } from "@/components/admin/admin-ui";

export default function DriversPage() {
  const [data, setData] = useState<AdminPaginator<AdminDriver>>(); const [search, setSearch] = useState(""); const [status, setStatus] = useState("pending"); const [page, setPage] = useState(1); const [error, setError] = useState("");
  const load = useCallback(() => { const q = new URLSearchParams({ page: String(page) }); if (search) q.set("search", search); if (status) q.set("status", status); apiRequest<AdminPaginator<AdminDriver>>(`/admin/drivers?${q}`).then(setData).catch((e) => setError(errorMessage(e))); }, [page, search, status]); useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);
  const action = async (driver: AdminDriver, next: string) => { if (!confirm(`${next} driver ${driver.user.name}?`)) return; try { await apiRequest(`/admin/drivers/${driver.id}/status`, { method: "PATCH", body: JSON.stringify({ status: next }) }); alert("Perubahan berhasil disimpan."); load(); } catch (e) { setError(errorMessage(e)); } };
  return <><PageTitle title="Drivers" description="Pending approval diprioritaskan untuk tim operasi." action={<div className="flex gap-2"><input className="admin-input" placeholder="Cari driver" value={search} onChange={(e) => setSearch(e.target.value)} /><select className="admin-input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Semua</option>{["pending", "approved", "rejected", "suspended"].map((s) => <option key={s}>{s}</option>)}</select></div>} />{error ? <ErrorState message={error} /> : !data ? <LoadingRows /> : !data.data.length ? <EmptyState /> : <div className="admin-card overflow-x-auto"><table className="admin-table"><thead><tr><th>Driver</th><th>Dokumen</th><th>Status</th><th>Online</th><th>Aksi</th><th></th></tr></thead><tbody>{data.data.map((d) => <tr key={d.id}><td><strong>{d.user.name}</strong><small>{d.user.phone}</small></td><td><span>{d.nik}</span><small>{d.license_number}</small></td><td><StatusBadge value={d.status} /></td><td>{d.is_online ? "Online" : "Offline"}</td><td><div className="flex flex-wrap gap-2"><button className="admin-btn-primary" onClick={() => void action(d, "approved")}>Approve</button><button className="admin-btn-secondary" onClick={() => void action(d, "rejected")}>Reject</button><button className="admin-btn-danger" onClick={() => void action(d, "suspended")}>Suspend</button></div></td><td><DetailLink href={`/drivers/${d.id}`} /></td></tr>)}</tbody></table><Pagination page={data.current_page} lastPage={data.last_page} onPage={setPage} /></div>}</>;
}


