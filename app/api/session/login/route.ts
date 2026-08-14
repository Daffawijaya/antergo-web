import { NextRequest, NextResponse } from "next/server";
import { laravelRequest } from "@/lib/api/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const upstream = await laravelRequest("/auth/login", {
    method: "POST",
    body: await request.text(),
  });
  const payload = await upstream.json();

  if (!upstream.ok) return NextResponse.json(payload, { status: upstream.status });
  if (!payload.user?.roles?.includes("admin")) {
    await laravelRequest("/auth/logout", { method: "POST" }, payload.token);
    return NextResponse.json({ message: "Akses dashboard hanya untuk administrator." }, { status: 403 });
  }

  const { token, ...safePayload } = payload;
  const response = NextResponse.json(safePayload);
  response.cookies.set("antergo_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

