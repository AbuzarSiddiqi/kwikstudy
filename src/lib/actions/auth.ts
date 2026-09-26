"use server";

import { redirect } from "next/navigation";
import { createUser, getUserByEmail } from "@/lib/queries";
import { hashPassword, verifyPassword } from "@/lib/auth-core";
import { createSession } from "@/lib/session";

export type AuthState = { error?: string; fieldErrors?: Record<string, string> } | null;

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const rawNext = String(formData.get("next") ?? "");
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "";

  if (!email) return { fieldErrors: { email: "Email is required" } };
  if (!password) return { fieldErrors: { password: "Password is required" } };

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "The email or password is incorrect. Please try again." };
  }

  await createSession(user.id);
  // Admins go straight to the management panel unless a specific page was requested.
  redirect(next || (user.role === "admin" ? "/admin" : "/dashboard"));
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const accept = formData.get("accept");
  const next = safeNextPath(String(formData.get("next") ?? ""));

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your full name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address";
  if (phone && !/^[+\d][\d\s-]{6,14}$/.test(phone)) fieldErrors.phone = "Enter a valid phone number";
  if (password.length < 8) fieldErrors.password = "Use at least 8 characters";
  else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) fieldErrors.password = "Include letters and numbers";
  if (password !== confirm) fieldErrors.confirm = "Passwords do not match";
  if (!accept) fieldErrors.accept = "Please accept the terms to continue";

  if (Object.keys(fieldErrors).length) return { fieldErrors };

  if (getUserByEmail(email)) return { fieldErrors: { email: "An account with this email already exists. Try logging in." } };

  const user = createUser({ email, passwordHash: hashPassword(password), name, phone: phone || null });

  await createSession(user.id);
  redirect(next || "/dashboard?welcome=1");
}

function safeNextPath(raw: string): string {
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "";
}
