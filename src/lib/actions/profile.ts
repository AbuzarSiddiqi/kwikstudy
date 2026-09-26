"use server";

import { revalidatePath } from "next/cache";
import { updateUserPassword, updateUserProfile, getUserById } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/auth-core";

export type ProfileState = { ok?: boolean; error?: string; message?: string; fieldErrors?: Record<string, string> } | null;

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your full name";
  if (phone && !/^[+\d][\d\s-]{6,14}$/.test(phone)) fieldErrors.phone = "Enter a valid phone number";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  updateUserProfile(user.id, name, phone || null);
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { ok: true, message: "Profile updated." };
}

export async function changePassword(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 8 || !/[a-zA-Z]/.test(next) || !/\d/.test(next))
    return { fieldErrors: { next: "Use at least 8 characters with letters and numbers" } };
  if (next !== confirm) return { fieldErrors: { confirm: "Passwords do not match" } };

  const full = getUserById(user.id);
  if (!full || !verifyPassword(current, full.password_hash)) return { fieldErrors: { current: "Your current password is incorrect" } };

  updateUserPassword(user.id, hashPassword(next));
  return { ok: true, message: "Password changed successfully." };
}
