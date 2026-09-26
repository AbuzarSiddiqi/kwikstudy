"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { Alert } from "@/components/Icons";
import { PasswordInput } from "@/components/PasswordInput";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(loginAction, null);

  return (
    <div>
      <h1 className="font-display text-[1.55rem] font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-[0.9rem] text-ink-500">
        Log in to continue learning, or{" "}
        <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="link-underline">
          create an account
        </Link>
        .
      </p>

      <form action={action} className="mt-7 space-y-4" noValidate>
        {state?.error && (
          <p className="flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-2.5 text-[0.83rem] font-medium text-accent-700" role="alert">
            <Alert width={15} height={15} /> {state.error}
          </p>
        )}
        <div>
          <label htmlFor="login-email" className="label">Email</label>
          <input id="login-email" name="email" type="email" className="input" autoComplete="email" required placeholder="you@example.com" />
          {state?.fieldErrors?.email && <p className="field-error">{state.fieldErrors.email}</p>}
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="login-password" className="label">Password</label>
            <span className="mb-1 text-[0.75rem] text-ink-400">
              Forgot it? <a href="mailto:support@kwikstudy.in" className="link-underline">Contact support</a>
            </span>
          </div>
          <PasswordInput id="login-password" name="password" autoComplete="current-password" required placeholder="••••••••" />
          {state?.fieldErrors?.password && <p className="field-error">{state.fieldErrors.password}</p>}
        </div>
        <input type="hidden" name="next" value={next ?? ""} />
        <button type="submit" className="btn btn-accent w-full" disabled={pending}>
          {pending ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p className="mt-8 border-t border-line pt-5 text-[0.8rem] leading-relaxed text-ink-400">
        Having trouble? Write to{" "}
        <a href="mailto:support@kwikstudy.in" className="link-underline">support@kwikstudy.in</a> from your registered
        email and we'll help you regain access.
      </p>
    </div>
  );
}
