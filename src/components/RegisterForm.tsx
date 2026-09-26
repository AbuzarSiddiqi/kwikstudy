"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type AuthState } from "@/lib/actions/auth";
import { Alert } from "@/components/Icons";
import { PasswordInput } from "@/components/PasswordInput";

export function RegisterForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(registerAction, null);

  return (
    <div>
      <h1 className="font-display text-[1.55rem] font-bold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-[0.9rem] text-ink-500">
        One account for enrollments, progress and certificates. Already enrolled?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="link-underline">Log in</Link>.
      </p>

      <form action={action} className="mt-7 space-y-4" noValidate>
        {state?.error && (
          <p className="flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-2.5 text-[0.83rem] font-medium text-accent-700" role="alert">
            <Alert width={15} height={15} /> {state.error}
          </p>
        )}
        <div>
          <label htmlFor="reg-name" className="label">Full name</label>
          <input id="reg-name" name="name" className="input" autoComplete="name" required placeholder="Your name" />
          {state?.fieldErrors?.name && <p className="field-error">{state.fieldErrors.name}</p>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-email" className="label">Email</label>
            <input id="reg-email" name="email" type="email" className="input" autoComplete="email" required placeholder="you@example.com" />
            {state?.fieldErrors?.email && <p className="field-error">{state.fieldErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="reg-phone" className="label">Phone <span className="font-normal text-ink-400">(optional)</span></label>
            <input id="reg-phone" name="phone" type="tel" className="input" autoComplete="tel" placeholder="+91 98XXX XXXXX" />
            {state?.fieldErrors?.phone && <p className="field-error">{state.fieldErrors.phone}</p>}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-password" className="label">Password</label>
            <PasswordInput id="reg-password" name="password" autoComplete="new-password" required placeholder="8+ characters" />
            <p className="field-hint">At least 8 characters, with letters and numbers.</p>
            {state?.fieldErrors?.password && <p className="field-error">{state.fieldErrors.password}</p>}
          </div>
          <div>
            <label htmlFor="reg-confirm" className="label">Confirm password</label>
            <PasswordInput id="reg-confirm" name="confirm" autoComplete="new-password" required placeholder="Repeat password" />
            {state?.fieldErrors?.confirm && <p className="field-error">{state.fieldErrors.confirm}</p>}
          </div>
        </div>
        <label className="flex cursor-pointer items-start gap-2.5 text-[0.85rem] leading-relaxed text-ink-600">
          <input type="checkbox" name="accept" className="mt-0.5 accent-[#c04a12]" />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" className="link-underline" target="_blank">Terms of Use</Link> and{" "}
            <Link href="/legal/privacy" className="link-underline" target="_blank">Privacy Policy</Link>.
          </span>
        </label>
        {state?.fieldErrors?.accept && <p className="field-error">{state.fieldErrors.accept}</p>}
        <input type="hidden" name="next" value={next ?? ""} />
        <button type="submit" className="btn btn-accent w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
