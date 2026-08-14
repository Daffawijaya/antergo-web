"use client";

import { useEffect, useState } from "react";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminPaginator, AdminUser } from "@/types/admin";
import { Badge, DetailLink, EmptyState, ErrorState, LoadingRows, PageTitle, Pagination, StatusBadge } from "@/components/admin/admin-ui";

export default function UsersPage() {
  const [data, setData] = useState<AdminPaginator<AdminUser>>(); const [search, setSearch] = useState(""); const [active, setActive] = useState(""); const [page, setPage] = useState(1); const [error, setError] = useState("");
  useEffect(() => { const timer = setTimeout(() => { const q = new URLSearchParams({ page: String(page) }); if (search) q.set("search", search); if (active) q.set("active", active); apiRequest<AdminPaginator<AdminUser>>(`/admin/users?${q}`).then(setData).catch((e) => setError(errorMessage(e))); }, 250); return () => clearTimeout(timer); }, [active, page, search]);
  return <><PageTitle title="Users" description="Akun, role, dan status akses pengguna." action={<div className="flex gap-2"><input className="admin-input" placeholder="Cari nama, email, telepon" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /><select className="admin-input" value={active} onChange={(e) => { setActive(e.target.value); setPage(1); }}><option value="">Semua status</option><option value="1">Aktif</option><option value="0">Nonaktif</option></select></div>} />
    {error ? <ErrorState message={error} /> : !data ? <LoadingRows /> : data.data.length === 0 ? <EmptyState /> : <div className="admin-card overflow-x-auto"><table className="admin-table"><thead><tr><th>User</th><th>Telepon</th><th>Roles</th><th>Status</th><th>Orders</th><th></th></tr></thead><tbody>{data.data.map((user) => <tr key={user.id}><td><strong>{user.name}</strong><small>{user.email}</small></td><td>{user.phone}</td><td><div className="flex flex-wrap gap-1">{user.roles.map((r) => <Badge key={r}>{r}</Badge>)}</div></td><td><StatusBadge value={user.is_active ? "active" : "inactive"} /></td><td>{user.orders_count ?? 0}</td><td><DetailLink href={`/users/${user.id}`} /></td></tr>)}</tbody></table><Pagination page={data.current_page} lastPage={data.last_page} onPage={setPage} /></div>}
  </>;
}
