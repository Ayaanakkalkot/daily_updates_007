import { NextResponse } from "next/server";
import { listUpdates } from "@/lib/github";

export async function GET() {
  try {
    const items = await listUpdates();
    const entries = items.map(({ date, data }) => ({ date, points: data.points }));
    return NextResponse.json({ entries });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
