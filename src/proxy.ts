import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const SECRET = "zintlr-daily-updates-jwt-secret-2026";

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

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname === "/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const data = verifyToken(token);
  if (!data) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("auth_token");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
