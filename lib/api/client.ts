import type { LaravelErrorPayload } from "@/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");

  const response = await fetch(`/api/backend${path.startsWith("/") ? path : `/${path}`}`, {
    ...init,
    headers,
    credentials: "same-origin",
  });

  const payload = (await response.json().catch(() => ({}))) as T & LaravelErrorPayload;
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event("antergo:unauthorized"));
    }
    throw new ApiError(payload.message ?? "Permintaan gagal diproses.", response.status, payload.errors);
  }

  return payload;
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const firstValidationError = Object.values(error.errors)[0]?.[0];
    return firstValidationError ?? error.message;
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}
