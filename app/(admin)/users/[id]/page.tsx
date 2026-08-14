"use client";

import { use, useCallback, useEffect, useState } from "react";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminUser } from "@/types/admin";
import { Badge, ErrorState, LoadingRows, PageTitle, StatusBadge } from "@/components/admin/admin-ui";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const [user, setUser] = useState<AdminUser>(); const [error, setError] = useState(""); const load = useCallback(() => apiRequest<{ user: AdminUser }>(`/admin/users/${id}`).then((r) => setUser(r.user)).catch((e) => setError(errorMessage(e))), [id]); useEffect(() => { void load(); }, [load]);
  const toggle = async () => { if (!user || !confirm(`${user.is_active ? "Nonaktifkan" : "Aktifkan"} akun ini?`)) return; try { await apiRequest(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ is_active: !user.is_active }) }); alert("Status user berhasil diperbarui."); load(); } catch (e) { setError(errorMessage(e)); } };
  return <><PageTitle title="Detail user" description="Identitas, roles, dan profile capability." />{error ? <ErrorState message={error} /> : !user ? <LoadingRows /> : <div className="grid gap-5 lg:grid-cols-2"><section className="admin-card space-y-3"><h2 className="text-xl font-black">{user.name}</h2><p>{user.email}</p><p>{user.phone}</p><div className="flex gap-2">{user.roles.map((r) => <Badge key={r}>{r}</Badge>)}</div><StatusBadge value={user.is_active ? "active" : "inactive"} /><p>{user.orders_count ?? 0} order</p><button className={user.is_active ? "admin-btn-danger" : "admin-btn-primary"} onClick={toggle}>{user.is_active ? "Nonaktifkan" : "Aktifkan"}</button></section><section className="admin-card"><h2 className="font-black">Profiles</h2><pre className="mt-4 overflow-auto whitespace-pre-wrap text-sm text-slate-600">{JSON.stringify({ driver: user.driver, merchant: user.merchant }, null, 2)}</pre></section></div>}</>;
}



