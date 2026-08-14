import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Admin registration is not public." }, { status: 404 });
}
