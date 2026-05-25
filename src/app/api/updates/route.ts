import { NextResponse } from "next/server";
import { listUpdates, getUserFolder } from "@/lib/github";
import { getUserFromCookie } from "@/lib/auth";

export async function GET() {
  const username = await getUserFromCookie();
  if (!username) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const items = await listUpdates(getUserFolder(username));
    const entries = items.map(({ date, data }) => ({ date, points: data.points }));
    return NextResponse.json({ entries });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
