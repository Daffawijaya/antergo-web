"use client";

import { use, useEffect, useState } from "react";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminDriver } from "@/types/admin";
import { ErrorState, LoadingRows, PageTitle, StatusBadge } from "@/components/admin/admin-ui";

export default function DriverDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); const [driver, setDriver] = useState<AdminDriver>(); const [error, setError] = useState(""); useEffect(() => { apiRequest<{ driver: AdminDriver }>(`/admin/drivers/${id}`).then((r) => setDriver(r.driver)).catch((e) => setError(errorMessage(e))); }, [id]);
  return <><PageTitle title="Detail driver" description="Profile, kendaraan, performa, dan lokasi terakhir." />{error ? <ErrorState message={error} /> : !driver ? <LoadingRows /> : <div className="grid gap-5 lg:grid-cols-3"><section className="admin-card space-y-2"><h2 className="text-xl font-black">{driver.user.name}</h2><p>{driver.user.email}</p><p>{driver.user.phone}</p><StatusBadge value={driver.status} /><p>Rating {driver.rating}</p><p>{driver.total_completed_orders} order selesai</p></section><section className="admin-card"><h2 className="font-black">Kendaraan</h2><pre className="mt-3 whitespace-pre-wrap text-sm">{JSON.stringify(driver.vehicle, null, 2)}</pre></section><section className="admin-card"><h2 className="font-black">Lokasi terakhir</h2><pre className="mt-3 whitespace-pre-wrap text-sm">{JSON.stringify(driver.location, null, 2)}</pre></section></div>}</>;
}
