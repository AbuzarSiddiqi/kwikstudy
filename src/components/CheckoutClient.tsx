"use client";

import { useActionState, useState, startTransition } from "react";
import { payAction, validateCoupon, type CheckoutState, type CouponResult } from "@/lib/actions/checkout";
import { Alert, Check, ShieldCheck, X } from "@/components/Icons";
import { rupees } from "@/lib/site";

const METHODS = [
  { id: "upi", label: "UPI", desc: "GPay, PhonePe, Paytm — instant confirmation" },
  { id: "card", label: "Card", desc: "Debit or credit, processed by the gateway" },
  { id: "netbanking", label: "Net banking", desc: "All major Indian banks" },
];

function CouponBox() {
  const [result, setResult] = useState<CouponResult>(null);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const applied = result?.ok ? result : null;

  return (
    <div>
      <label htmlFor="coupon" className="label">Have a coupon?</label>
      {applied ? (
        <div className="flex items-center justify-between rounded-lg border border-moss-100 bg-moss-50 px-3.5 py-2.5">
          <span className="flex items-center gap-2 text-[0.85rem] font-medium text-moss-700">
            <Check width={15} height={15} /> {applied.code} — {applied.percentOff}% off applied
          </span>
          <button
            type="button"
            onClick={() => { setResult(null); setCode(""); }}
            className="text-moss-600 hover:text-moss-700"
            aria-label="Remove coupon"
          >
            <X width={15} height={15} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            id="coupon"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. WELCOME10"
            className="input flex-1 font-mono uppercase"
            autoComplete="off"
          />
          <button
            type="button"
            className="btn btn-outline"
            disabled={pending || !code.trim()}
            onClick={() => {
              const fd = new FormData();
              fd.set("code", code);
              setPending(true);
              startTransition(async () => {
                const res = await validateCoupon(null, fd);
                setResult(res);
                setPending(false);
              });
            }}
          >
            {pending ? "…" : "Apply"}
          </button>
        </div>
      )}
      {result && !result.ok && <p className="field-error">{result.error}</p>}
      {applied && <input type="hidden" name="couponCode" value={applied.code} />}
      <p className="field-hint">Current offer: WELCOME10 — 10% off your first KwikStudy course.</p>
    </div>
  );
}

export function CheckoutClient({
  course,
  student,
}: {
  course: { slug: string; title: string; price: number; originalPrice: number | null; instructor: string; coverCode: string };
  student: { name: string; email: string };
}) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(payAction, null);
  const [method, setMethod] = useState("upi");
  const discountFromOriginal = course.originalPrice ? course.originalPrice - course.price : 0;

  return (
    <form action={action} className="grid gap-10 lg:grid-cols-[1fr_23rem]" noValidate>
      <input type="hidden" name="courseSlug" value={course.slug} />
      <input type="hidden" name="method" value={method} />

      <div className="space-y-8">
        {state?.error && (
          <p className="flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-4 py-3 text-[0.88rem] font-medium text-accent-700" role="alert">
            <Alert width={16} height={16} /> {state.error}
          </p>
        )}

        {/* student details */}
        <section className="card p-6">
          <h2 className="mb-1 font-display text-[1.05rem] font-bold">Student details</h2>
          <p className="mb-4 text-[0.82rem] text-ink-400">Enrollment is created for your signed-in account.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="label">Full name</span>
              <p className="rounded-lg border border-line bg-paper-deep/60 px-3.5 py-2.5 text-[0.9rem] text-ink-700">{student.name}</p>
            </div>
            <div>
              <span className="label">Email</span>
              <p className="rounded-lg border border-line bg-paper-deep/60 px-3.5 py-2.5 text-[0.9rem] text-ink-700">{student.email}</p>
            </div>
          </div>
        </section>

        {/* payment method */}
        <section className="card p-6">
          <h2 className="mb-1 font-display text-[1.05rem] font-bold">Payment method</h2>
          <p className="mb-4 text-[0.82rem] text-ink-400">Payments are processed by our secure payment gateway.</p>
          <div className="space-y-2.5" role="radiogroup" aria-label="Payment method">
            {METHODS.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-center gap-3.5 rounded-lg border px-4 py-3.5 transition-colors ${
                  method === m.id ? "border-accent-600 bg-accent-50/60" : "border-line hover:border-ink-300"
                }`}
              >
                <input
                  type="radio"
                  name="methodChoice"
                  value={m.id}
                  checked={method === m.id}
                  onChange={() => setMethod(m.id)}
                  className="accent-[#c04a12]"
                />
                <span className="font-display text-[0.9rem] font-semibold text-ink-900">{m.label}</span>
                <span className="text-[0.82rem] text-ink-500">{m.desc}</span>
              </label>
            ))}
          </div>
          <CouponBox />
        </section>

        {/* consent */}
        <section className="card p-6">
          <h2 className="mb-4 font-display text-[1.05rem] font-bold">Confirmation</h2>
          <label className="flex cursor-pointer items-start gap-2.5 text-[0.87rem] leading-relaxed text-ink-600">
            <input type="checkbox" name="acceptTerms" className="mt-0.5 accent-[#c04a12]" />
            <span>
              I agree to the{" "}
              <a href="/legal/terms" target="_blank" className="link-underline">Terms of Use</a> and understand the{" "}
              <a href="/legal/refund-policy" target="_blank" className="link-underline">7-day refund policy</a>.
            </span>
          </label>
        </section>
      </div>

      {/* summary */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="card p-6">
          <h2 className="eyebrow mb-4">Order summary</h2>
          <div className="mb-4 rounded-lg border border-line bg-paper-deep/50 p-4">
            <p className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-400">{course.coverCode}</p>
            <p className="mt-1 font-display text-[0.95rem] font-semibold leading-snug text-ink-900">{course.title}</p>
            <p className="mt-0.5 text-[0.78rem] text-ink-500">Instructor: {course.instructor}</p>
          </div>
          <dl className="space-y-2.5 text-[0.88rem]">
            <div className="flex justify-between">
              <dt className="text-ink-500">Course price</dt>
              <dd className="tabular text-ink-700">{rupees(course.price)}</dd>
            </div>
            {discountFromOriginal > 0 && (
              <div className="flex justify-between">
                <dt className="text-ink-500">Launch discount</dt>
                <dd className="tabular text-moss-600">−{rupees(discountFromOriginal)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-500">Coupon</dt>
              <dd className="text-ink-400">applied at pay time</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="font-display font-bold text-ink-900">Total payable</dt>
              <dd className="font-display text-[1.1rem] font-bold tabular text-ink-900">{rupees(course.price)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn btn-accent mt-5 w-full" disabled={pending}>
            {pending ? "Processing payment…" : `Pay ${rupees(course.price)}`}
          </button>
          <p className="mt-4 flex items-start gap-2 text-[0.75rem] leading-relaxed text-ink-400">
            <ShieldCheck width={15} height={15} className="mt-0.5 shrink-0" />
            256-bit encrypted checkout. Enrollment is activated only after the payment is verified on our servers.
          </p>
        </div>
      </aside>
    </form>
  );
}
