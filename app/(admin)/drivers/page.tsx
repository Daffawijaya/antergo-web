"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DetailLink,
  EmptyState,
  ErrorState,
  LoadingRows,
  PageTitle,
  Pagination,
  StatusBadge,
} from "@/components/admin/admin-ui";
import { apiRequest, errorMessage } from "@/lib/api/client";
import type { AdminDriver, AdminPaginator } from "@/types/admin";

export default function DriversPage() {
  const [data, setData] = useState<AdminPaginator<AdminDriver>>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<number>();

  const load = useCallback(() => {
    setError("");

    const query = new URLSearchParams({
      page: String(page),
    });

    if (search.trim()) {
      query.set("search", search.trim());
    }

    if (status) {
      query.set("status", status);
    }

    apiRequest<AdminPaginator<AdminDriver>>(
      `/admin/drivers?${query.toString()}`,
    )
      .then(setData)
      .catch((requestError) => {
        setError(errorMessage(requestError));
      });
  }, [page, search, status]);

  useEffect(() => {
    const timeout = setTimeout(load, 250);

    return () => clearTimeout(timeout);
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  const action = async (
    driver: AdminDriver,
    nextStatus: "approved" | "rejected" | "suspended",
  ) => {
    const labels = {
      approved: "menyetujui",
      rejected: "menolak",
      suspended: "menangguhkan",
    };

    if (
      !window.confirm(
        `Yakin ingin ${labels[nextStatus]} driver ${driver.user.name}?`,
      )
    ) {
      return;
    }

    try {
      setError("");
      setProcessingId(driver.id);

      await apiRequest(`/admin/drivers/${driver.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      load();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setProcessingId(undefined);
    }
  };

  return (
    <>
      <PageTitle
        title="Driver"
        description="Verifikasi pendaftaran dan kelola status driver anterGo."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="admin-input"
              placeholder="Cari nama, nomor HP, NIK..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              className="admin-input"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Semua status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        }
      />

      {error ? (
        <ErrorState message={error} />
      ) : !data ? (
        <LoadingRows />
      ) : !data.data.length ? (
        <EmptyState />
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>NIK</th>
                <th>Status</th>
                <th>Online</th>
                <th>Rating</th>
                <th>Aksi</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {data.data.map((driver) => {
                const processing = processingId === driver.id;

                return (
                  <tr key={driver.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {driver.user.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={driver.user.avatar}
                            alt={driver.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-500">
                            {driver.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <strong>{driver.user.name}</strong>
                          <small>{driver.user.phone}</small>
                        </div>
                      </div>
                    </td>

                    <td>{driver.nik}</td>

                    <td>
                      <StatusBadge value={driver.status} />
                    </td>

                    <td>{driver.is_online ? "Online" : "Offline"}</td>

                    <td>{Number(driver.rating ?? 0).toFixed(1)}</td>

                    <td>
                      <div className="flex flex-wrap gap-2">
                        {driver.status === "pending" ? (
                          <>
                            <button
                              className="admin-btn-primary"
                              disabled={processing}
                              onClick={() => void action(driver, "approved")}
                            >
                              Approve
                            </button>

                            <button
                              className="admin-btn-secondary"
                              disabled={processing}
                              onClick={() => void action(driver, "rejected")}
                            >
                              Reject
                            </button>
                          </>
                        ) : null}

                        {driver.status === "approved" ? (
                          <button
                            className="admin-btn-danger"
                            disabled={processing}
                            onClick={() => void action(driver, "suspended")}
                          >
                            Suspend
                          </button>
                        ) : null}

                        {driver.status === "rejected" ||
                        driver.status === "suspended" ? (
                          <button
                            className="admin-btn-primary"
                            disabled={processing}
                            onClick={() => void action(driver, "approved")}
                          >
                            Approve
                          </button>
                        ) : null}
                      </div>
                    </td>

                    <td>
                      <DetailLink href={`/drivers/${driver.id}`} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <Pagination
            page={data.current_page}
            lastPage={data.last_page}
            onPage={setPage}
          />
        </div>
      )}
    </>
  );
}
