import { createHmac } from "crypto";
import { cookies } from "next/headers";

const SECRET = "zintlr-daily-updates-jwt-secret-2026";

export async function getUserFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = createHmac("sha256", SECRET).update(payload).digest("base64url");
    if (expected !== sig) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Date.now()) return null;
    return data.username;
  } catch {
    return null;
  }
}
