import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { sign } from "@/lib/auth-core";
import { store, type UserRow } from "@/lib/store";

export const SESSION_COOKIE = "ks_session";
const SESSION_DAYS = 30;

export type SafeUser = Pick<UserRow, "id" | "email" | "name" | "role" | "phone" | "created_at">;

/* Stateless sessions for the demo: the cookie carries the user id and an
   expiry, HMAC-signed so it cannot be forged. No server-side session store —
   which is what allows login to survive across serverless instances. */

function sessionSecret(): string {
  return process.env.SESSION_SECRET ?? process.env.PAYMENT_WEBHOOK_SECRET ?? "ks_demo_secret";
}

function encodeToken(userId: string): string {
  const expires = Date.now() + SESSION_DAYS * 86400_000;
  const payload = `${userId}:${expires}`;
  return `${payload}:${sign(payload, sessionSecret())}`;
}

function decodeToken(token: string): string | null {
  const parts = token.split(":");
  if (parts.length !== 3) return null;
  const [userId, expires, signature] = parts;
  if (sign(`${userId}:${expires}`, sessionSecret()) !== signature) return null;
  if (Number(expires) < Date.now()) return null;
  return userId;
}

export const getCurrentUser = cache(async (): Promise<SafeUser | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = decodeToken(token);
  if (!userId) return null;
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone, created_at: user.created_at };
});

export async function createSession(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function requireUser(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/?denied=admin");
  return user;
}

export function safeNext(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return fallback;
}
