import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, safeNext } from "@/lib/session";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(safeNext(next));
  return <RegisterForm next={safeNext(next, "")} />;
}
