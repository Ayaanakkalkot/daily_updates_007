import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode("zintlr-daily-updates-jwt-secret-2026");

const USERS: Record<string, string> = {
  "yashwanth.a@zintlr.com": "arvan123",
  "ayaan.a@zintlr.com": "ayaan123",
};

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!USERS[username] || USERS[username] !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SECRET);

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
