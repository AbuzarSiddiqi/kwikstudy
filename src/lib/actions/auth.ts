"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth-core";
import { createSession, safeNext } from "@/lib/session";

export type AuthState = { error?: string; fieldErrors?: Record<string, string> } | null;

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  if (!email) return { fieldErrors: { email: "Email is required" } };
  if (!password) return { fieldErrors: { password: "Password is required" } };

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
    | { id: string; password_hash: string; name: string }
    | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "The email or password is incorrect. Please try again." };
  }

  await createSession(user.id);
  redirect(next);
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const accept = formData.get("accept");
  const next = safeNext(String(formData.get("next") ?? ""));

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your full name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address";
  if (phone && !/^[+\d][\d\s-]{6,14}$/.test(phone)) fieldErrors.phone = "Enter a valid phone number";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters";
  else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) fieldErrors.password = "Include letters and numbers";
  if (password !== confirm) fieldErrors.confirm = "Passwords do not match";
  if (!accept) fieldErrors.accept = "Please accept the terms to continue";

  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return { fieldErrors: { email: "An account with this email already exists. Try logging in." } };

  const id = `usr_${crypto.randomUUID().slice(0, 12)}`;
  db.prepare("INSERT INTO users (id, email, password_hash, name, role, phone, created_at) VALUES (?,?,?,?,'student',?,?)")
    .run(id, email, hashPassword(password), name, phone || null, new Date().toISOString());

  await createSession(id);
  redirect(next || "/dashboard?welcome=1");
}
