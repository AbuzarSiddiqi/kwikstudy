"use client";

import { useActionState } from "react";
import { updateProfile, changePassword, type ProfileState } from "@/lib/actions/profile";
import { Check, Alert } from "@/components/Icons";
import { PasswordInput } from "@/components/PasswordInput";

function FormMessage({ state }: { state: ProfileState }) {
  if (!state) return null;
  if (state.ok) return (
    <p className="mb-4 flex items-center gap-2 rounded-lg border border-moss-100 bg-moss-50 px-3.5 py-2.5 text-[0.83rem] font-medium text-moss-700" role="status">
      <Check width={15} height={15} /> {state.message}
    </p>
  );
  if (state.error) return (
    <p className="mb-4 flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-2.5 text-[0.83rem] font-medium text-accent-700" role="alert">
      <Alert width={15} height={15} /> {state.error}
    </p>
  );
  return null;
}

export function ProfileForm({ name, phone, email }: { name: string; phone: string | null; email: string }) {
  const [state, action, pending] = useActionState<ProfileState, FormData>(updateProfile, null);
  return (
    <form action={action} className="card p-6">
      <h2 className="mb-1 font-display text-[1.05rem] font-bold">Profile</h2>
      <p className="mb-4 text-[0.82rem] text-ink-400">Used on certificates and for course communication.</p>
      <FormMessage state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pf-name" className="label">Full name</label>
          <input id="pf-name" name="name" className="input" defaultValue={name} required />
          {state?.fieldErrors?.name && <p className="field-error">{state.fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="pf-phone" className="label">Phone</label>
          <input id="pf-phone" name="phone" type="tel" className="input" defaultValue={phone ?? ""} placeholder="+91 98XXX XXXXX" />
          {state?.fieldErrors?.phone && <p className="field-error">{state.fieldErrors.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <span className="label">Email</span>
          <p className="rounded-lg border border-line bg-paper-deep/60 px-3.5 py-2.5 text-[0.9rem] text-ink-500">{email} <span className="ml-2 text-[0.72rem]">(contact support to change)</span></p>
        </div>
      </div>
      <button className="btn btn-primary mt-5" disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<ProfileState, FormData>(changePassword, null);
  return (
    <form action={action} className="card p-6">
      <h2 className="mb-1 font-display text-[1.05rem] font-bold">Password</h2>
      <p className="mb-4 text-[0.82rem] text-ink-400">Use at least 8 characters with letters and numbers.</p>
      <FormMessage state={state} />
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="pw-current" className="label">Current</label>
          <PasswordInput id="pw-current" name="current" autoComplete="current-password" required />
          {state?.fieldErrors?.current && <p className="field-error">{state.fieldErrors.current}</p>}
        </div>
        <div>
          <label htmlFor="pw-next" className="label">New</label>
          <PasswordInput id="pw-next" name="next" autoComplete="new-password" required />
          {state?.fieldErrors?.next && <p className="field-error">{state.fieldErrors.next}</p>}
        </div>
        <div>
          <label htmlFor="pw-confirm" className="label">Confirm new</label>
          <PasswordInput id="pw-confirm" name="confirm" autoComplete="new-password" required />
          {state?.fieldErrors?.confirm && <p className="field-error">{state.fieldErrors.confirm}</p>}
        </div>
      </div>
      <button className="btn btn-primary mt-5" disabled={pending}>{pending ? "Updating…" : "Change password"}</button>
    </form>
  );
}
