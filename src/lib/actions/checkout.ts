"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  courseBySlugPublished, findEnrollment, validCoupon, createOrder, setOrderProviderRef,
  setOrderStatus, createPayment, createEnrollment,
} from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { getProvider } from "@/lib/payments";

export type CouponResult =
  | { ok: true; code: string; percentOff: number; message: string }
  | { ok: false; error: string }
  | null;

export async function validateCoupon(_prev: CouponResult, formData: FormData): Promise<CouponResult> {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) return { ok: false, error: "Enter a coupon code" };
  const coupon = validCoupon(code);
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

  const course = courseBySlugPublished(courseSlug);
  if (!course) return { error: "This course is no longer available for enrollment." };
  if (!acceptTerms) return { error: "Please accept the terms and refund policy to continue." };
  if (!["upi", "card", "netbanking"].includes(method)) return { error: "Choose a payment method." };

  if (findEnrollment(user.id, course.id)) redirect("/dashboard/courses?already=1");

  let discount = 0;
  if (couponCode) {
    const coupon = validCoupon(couponCode);
    if (!coupon) return { error: `Coupon ${couponCode} is not valid.` };
    discount = Math.round((course.price * coupon.percent_off) / 100);
  }
  const total = course.price - discount;
  const amountInPaise = total * 100;
  const provider = getProvider();

  const order = createOrder({
    userId: user.id, courseId: course.id, amount: course.price,
    discount, total, couponCode: couponCode || null, provider: provider.name,
  });

  let providerOrderId: string;
  try {
    ({ providerOrderId } = await provider.createOrder(amountInPaise, order.id));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not start the payment. Please try again." };
  }
  setOrderProviderRef(order.id, providerOrderId);

  // Server-side verification + capture — enrollment is only activated here,
  // never from frontend state.
  const result = await provider.capture(providerOrderId, amountInPaise);
  if (!result.ok) {
    setOrderStatus(order.id, "failed");
    return { error: "Payment could not be verified. No amount was charged — please try again." };
  }

  createPayment(order.id, result.providerPaymentId, method, total);
  setOrderStatus(order.id, "paid");
  createEnrollment(user.id, course.id, order.id);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  redirect(`/dashboard/courses?enrolled=${encodeURIComponent(course.title)}`);
}
