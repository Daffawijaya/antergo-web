import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { laravelRequest } from "@/lib/api/server";

type Context = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: Context): Promise<NextResponse> {
  const { path } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("antergo_token")?.value;
  const query = request.nextUrl.search;
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
  const upstream = await laravelRequest(`/${path.join("/")}${query}`, {
    method: request.method,
    body: body || undefined,
    headers: { "Content-Type": request.headers.get("Content-Type") ?? "application/json" },
  }, token);
  const response = new NextResponse(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });

  if (upstream.status === 401) response.cookies.delete("antergo_token");
  return response;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
