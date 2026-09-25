"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getProvider } from "@/lib/payments";
import { newId } from "@/lib/auth-core";

export type CouponResult =
  | { ok: true; code: string; percentOff: number; message: string }
  | { ok: false; error: string }
  | null;

export async function validateCoupon(_prev: CouponResult, formData: FormData): Promise<CouponResult> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a coupon code" };
  const coupon = db.prepare("SELECT * FROM coupons WHERE code = ? AND active = 1").get(code) as
    | { code: string; percent_off: number } | undefined;
  if (!coupon) return { ok: false, error: "This coupon is not valid or has expired" };
  return { ok: true, code: coupon.code, percentOff: coupon.percent_off, message: `${coupon.percent_off}% off applied` };
}

export type CheckoutState = { error?: string } | null;

export async function payAction(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const user = await requireUser();
  const courseSlug = String(formData.get("courseSlug") ?? "");
  const method = String(formData.get("method") ?? "upi");
  const couponCode = String(formData.get("couponCode") ?? "").trim().toUpperCase();
  const acceptTerms = formData.get("acceptTerms");

  const course = db.prepare("SELECT * FROM courses WHERE slug = ? AND status = 'published'").get(courseSlug) as
    | { id: string; title: string; price: number } | undefined;
  if (!course) return { error: "This course is no longer available for enrollment." };
  if (!acceptTerms) return { error: "Please accept the terms and refund policy to continue." };
  if (!["upi", "card", "netbanking"].includes(method)) return { error: "Choose a payment method." };

  const existing = db.prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?").get(user.id, course.id);
  if (existing) redirect("/dashboard/courses?already=1");

  let discount = 0;
  if (couponCode) {
    const coupon = db.prepare("SELECT * FROM coupons WHERE code = ? AND active = 1").get(couponCode) as
      | { percent_off: number } | undefined;
    if (!coupon) return { error: `Coupon ${couponCode} is not valid.` };
    discount = Math.round((course.price * coupon.percent_off) / 100);
  }
  const total = course.price - discount;
  const amountInPaise = total * 100;
  const provider = getProvider();

  const orderId = newId("ord");
  db.prepare(
    "INSERT INTO orders (id, user_id, course_id, amount, discount, total, coupon_code, status, provider, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)"
  ).run(orderId, user.id, course.id, course.price, discount, total, couponCode || null, "created", provider.name, new Date().toISOString());

  let providerOrderId: string;
  try {
    ({ providerOrderId } = await provider.createOrder(amountInPaise, orderId));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not start the payment. Please try again." };
  }
  db.prepare("UPDATE orders SET provider_order_id = ? WHERE id = ?").run(providerOrderId, orderId);

  // Server-side verification + capture — enrollment is only activated here,
  // never from frontend state.
  const result = await provider.capture(providerOrderId, amountInPaise);
  if (!result.ok) {
    db.prepare("UPDATE orders SET status = 'failed' WHERE id = ?").run(orderId);
    return { error: "Payment could not be verified. No amount was charged — please try again." };
  }

  const paymentId = newId("pay");
  db.prepare("INSERT INTO payments (id, order_id, provider_payment_id, method, amount, status, paid_at) VALUES (?,?,?,?,?,?,?)")
    .run(paymentId, orderId, result.providerPaymentId, method, total, "captured", new Date().toISOString());
  db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run(orderId);

  const already = db.prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?").get(user.id, course.id);
  if (!already) {
    db.prepare("INSERT INTO enrollments (id, user_id, course_id, enrolled_at, status, order_id) VALUES (?,?,?,?,'active',?)")
      .run(newId("enr"), user.id, course.id, new Date().toISOString(), orderId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  redirect(`/dashboard/courses?enrolled=${encodeURIComponent(course.title)}`);
}
