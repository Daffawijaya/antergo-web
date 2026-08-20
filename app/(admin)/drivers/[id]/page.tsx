"use client";

import { use, useCallback, useEffect, useState } from "react";

import {
  ErrorState,
  LoadingRows,
  PageTitle,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminDriver } from "@/types/admin";

type DriverDocument = {
  id: number;
  type: "ktp" | "sim_a" | "sim_c";
  uploaded: boolean;
  url: string;
  created_at: string;
  updated_at: string;
};

type DriverVehicle = {
  id: number;
  type: "motorcycle" | "car";
  brand: string;
  model: string;
  plate_number: string;
  color: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

type DriverDetail = AdminDriver & {
  active_vehicle_id?: number | null;
  documents: DriverDocument[];
  vehicles: DriverVehicle[];
};

function documentName(type: DriverDocument["type"]) {
  switch (type) {
    case "ktp":
      return "KTP";
    case "sim_a":
      return "SIM A";
    case "sim_c":
      return "SIM C";
  }
}

function vehicleType(type: DriverVehicle["type"]) {
  return type === "car" ? "Mobil" : "Motor";
}

export default function DriverDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [driver, setDriver] = useState<DriverDetail>();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const load = useCallback(() => {
    setError("");

    apiRequest<{ driver: DriverDetail }>(`/admin/drivers/${id}`)
      .then((response) => {
        setDriver(response.driver);
      })
      .catch((requestError) => {
        setError(errorMessage(requestError));
      });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (
    status: "approved" | "rejected" | "suspended",
  ) => {
    if (!driver) {
      return;
    }

    const messages = {
      approved: `Setujui ${driver.user.name} sebagai driver anterGo?`,
      rejected: `Tolak pengajuan driver ${driver.user.name}?`,
      suspended: `Tangguhkan akses driver ${driver.user.name}?`,
    };

    if (!window.confirm(messages[status])) {
      return;
    }

    try {
      setProcessing(true);
      setError("");

      await apiRequest(`/admin/drivers/${driver.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      });

      load();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Detail driver"
        description="Periksa profil, dokumen, dan kendaraan sebelum menyetujui driver."
      />

      {error ? (
        <ErrorState message={error} />
      ) : !driver ? (
        <LoadingRows />
      ) : (
        <div className="space-y-6">
          <section className="admin-card">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              {driver.user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={driver.user.avatar}
                  alt={driver.user.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 text-3xl font-black text-neutral-500">
                  {driver.user.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-black">{driver.user.name}</h2>

                  <StatusBadge value={driver.status} />
                </div>

                <div className="grid gap-1 text-sm text-neutral-600 sm:grid-cols-2">
                  <p>{driver.user.email}</p>
                  <p>{driver.user.phone}</p>
                  <p>NIK: {driver.nik}</p>
                  <p>{driver.is_online ? "Online" : "Offline"}</p>
                </div>

                <div className="mt-4 flex gap-5 text-sm">
                  <span>
                    Rating{" "}
                    <strong>{Number(driver.rating ?? 0).toFixed(1)}</strong>
                  </span>

                  <span>
                    <strong>{driver.total_completed_orders}</strong> order
                    selesai
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-xl font-black">Dokumen</h2>
              <p className="text-sm text-neutral-500">
                Pastikan data terlihat jelas dan sesuai dengan pemilik akun.
              </p>
            </div>

            {driver.documents.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {driver.documents.map((document) => (
                  <div
                    key={document.id}
                    className="admin-card overflow-hidden p-0"
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      <strong>{documentName(document.type)}</strong>
                      <span className="text-xs text-neutral-500">
                        Terunggah
                      </span>
                    </div>

                    <a
                      href={document.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block bg-neutral-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={document.url}
                        alt={documentName(document.type)}
                        className="aspect-[1.58/1] w-full object-contain"
                      />
                    </a>

                    <div className="p-4">
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-btn-secondary inline-flex"
                      >
                        Lihat ukuran penuh
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-card text-sm text-neutral-500">
                Belum ada dokumen.
              </div>
            )}
          </section>

          <section>
            <div className="mb-3">
              <h2 className="text-xl font-black">Kendaraan</h2>
              <p className="text-sm text-neutral-500">
                Periksa jenis kendaraan, identitas, dan plat nomor.
              </p>
            </div>

            {driver.vehicles.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {driver.vehicles.map((vehicle) => (
                  <article
                    key={vehicle.id}
                    className="admin-card overflow-hidden p-0"
                  >
                    {vehicle.image_url ? (
                      <a
                        href={vehicle.image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block bg-neutral-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={vehicle.image_url}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="aspect-video w-full object-cover"
                        />
                      </a>
                    ) : (
                      <div className="flex aspect-video items-center justify-center bg-neutral-100 text-sm text-neutral-500">
                        Foto kendaraan tidak tersedia
                      </div>
                    )}

                    <div className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            {vehicleType(vehicle.type)}
                          </span>

                          <h3 className="text-xl font-black">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                        </div>

                        {driver.active_vehicle_id === vehicle.id ? (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            Kendaraan aktif
                          </span>
                        ) : null}
                      </div>

                      <dl className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-neutral-500">Nomor polisi</dt>
                          <dd className="font-bold">{vehicle.plate_number}</dd>
                        </div>

                        <div>
                          <dt className="text-neutral-500">Warna</dt>
                          <dd className="font-bold">{vehicle.color}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="admin-card text-sm text-neutral-500">
                Belum ada kendaraan.
              </div>
            )}
          </section>

          {driver.location ? (
            <section className="admin-card">
              <h2 className="mb-3 text-xl font-black">Lokasi terakhir</h2>

              <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(driver.location).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-neutral-500">{key}</dt>
                    <dd className="break-all font-semibold">
                      {String(value ?? "-")}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <section className="admin-card">
            <h2 className="text-xl font-black">Keputusan</h2>

            <p className="mt-1 text-sm text-neutral-500">
              Pastikan foto driver, KTP, SIM, dan kendaraan telah diperiksa
              sebelum melakukan perubahan status.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {driver.status === "pending" ? (
                <>
                  <button
                    className="admin-btn-primary"
                    disabled={processing}
                    onClick={() => void updateStatus("approved")}
                  >
                    {processing ? "Memproses..." : "Setujui Driver"}
                  </button>

                  <button
                    className="admin-btn-secondary"
                    disabled={processing}
                    onClick={() => void updateStatus("rejected")}
                  >
                    Tolak Pengajuan
                  </button>
                </>
              ) : null}

              {driver.status === "approved" ? (
                <button
                  className="admin-btn-danger"
                  disabled={processing}
                  onClick={() => void updateStatus("suspended")}
                >
                  Tangguhkan Driver
                </button>
              ) : null}

              {driver.status === "rejected" || driver.status === "suspended" ? (
                <button
                  className="admin-btn-primary"
                  disabled={processing}
                  onClick={() => void updateStatus("approved")}
                >
                  Aktifkan sebagai Driver
                </button>
              ) : null}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
