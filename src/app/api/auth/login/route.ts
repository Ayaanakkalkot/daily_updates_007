import { NextRequest, NextResponse } from "next/server";
import { createHmac, randomBytes } from "crypto";

const SECRET = "zintlr-daily-updates-jwt-secret-2026";

const USERS: Record<string, string> = {
  "yashwanth.a@zintlr.com": "arvan123",
  "ayaan.a@zintlr.com": "ayaan123",
};

function makeToken(username: string): string {
  const payload = Buffer.from(JSON.stringify({ username, exp: Date.now() + 30 * 24 * 60 * 60 * 1000 })).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!USERS[username] || USERS[username] !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = makeToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
