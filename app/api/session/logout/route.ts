import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { laravelRequest } from "@/lib/api/server";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("antergo_token")?.value;
  if (token) await laravelRequest("/auth/logout", { method: "POST" }, token).catch(() => null);

  const response = NextResponse.json({ message: "Logout berhasil." });
  response.cookies.delete("antergo_token");
  return response;
}
