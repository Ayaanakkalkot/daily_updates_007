import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const SECRET = "zintlr-daily-updates-jwt-secret-2026";

const DISPLAY_NAMES: Record<string, string> = {
  "yashwanth.a@zintlr.com": "Yashwanth",
  "ayaan.a@zintlr.com": "Ayaan",
};

function verifyToken(token: string): { username: string } | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = createHmac("sha256", SECRET).update(payload).digest("base64url");
    if (expected !== sig) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  const data = verifyToken(token);
  if (!data) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({
    username: data.username,
    displayName: DISPLAY_NAMES[data.username] || data.username,
  });
}
