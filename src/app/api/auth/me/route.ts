import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode("zintlr-daily-updates-jwt-secret-2026");

const DISPLAY_NAMES: Record<string, string> = {
  "yashwanth.a@zintlr.com": "Yashwanth",
  "ayaan.a@zintlr.com": "Ayaan",
};

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const username = payload.username as string;
    return NextResponse.json({
      username,
      displayName: DISPLAY_NAMES[username] || username,
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
