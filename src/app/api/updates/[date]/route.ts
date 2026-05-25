import { NextRequest, NextResponse } from "next/server";
import { getUpdate, saveUpdate } from "@/lib/github";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  try {
    const data = await getUpdate(date);
    if (!data) return NextResponse.json(null, { status: 404 });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  try {
    const body = await req.json();
    await saveUpdate(date, body);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
