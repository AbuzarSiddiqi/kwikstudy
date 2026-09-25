"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/lib/actions/enquiry";
import { Check, Alert } from "@/components/Icons";

const TOPICS = ["Course enquiry", "Fees & offers", "Batches", "Corporate training", "Career programs", "General"];

export function EnquiryForm({
  defaultTopic = "Course enquiry",
  defaultCourse = "",
  courses,
  compact = false,
}: {
  defaultTopic?: string;
  defaultCourse?: string;
  courses: { slug: string; title: string }[];
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, null);
  const v = state && !state.ok ? (state.values ?? {}) : {};

  if (state?.ok) {
    return (
      <div className="card flex flex-col items-center px-6 py-12 text-center" role="status">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-moss-50 text-moss-600">
          <Check width={22} height={22} />
        </span>
        <h3 className="mb-2 font-display text-[1.15rem] font-bold text-ink-900">Enquiry received</h3>
        <p className="max-w-sm text-[0.9rem] leading-relaxed text-ink-500">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className={compact ? "" : "card p-6 sm:p-7"} noValidate>
      {state && !state.ok && state.error && (
        <p className="mb-4 flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-2.5 text-[0.83rem] font-medium text-accent-700" role="alert">
          <Alert width={15} height={15} /> {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="eq-name" className="label">Full name <span aria-hidden>*</span></label>
          <input id="eq-name" name="name" key={`n-${v.name ?? ""}`} className="input" placeholder="Your name" autoComplete="name" required defaultValue={v.name ?? ""} />
          {state && !state.ok && state.fieldErrors?.name && <p className="field-error">{state.fieldErrors.name}</p>}
        </div>
        <div>
          <label htmlFor="eq-email" className="label">Email <span aria-hidden>*</span></label>
          <input id="eq-email" name="email" type="email" key={`e-${v.email ?? ""}`} className="input" placeholder="you@example.com" autoComplete="email" required defaultValue={v.email ?? ""} />
          {state && !state.ok && state.fieldErrors?.email && <p className="field-error">{state.fieldErrors.email}</p>}
        </div>
        <div>
          <label htmlFor="eq-phone" className="label">Phone</label>
          <input id="eq-phone" name="phone" type="tel" key={`p-${v.phone ?? ""}`} className="input" placeholder="+91 98XXX XXXXX" autoComplete="tel" defaultValue={v.phone ?? ""} />
          {state && !state.ok && state.fieldErrors?.phone && <p className="field-error">{state.fieldErrors.phone}</p>}
        </div>
        <div>
          <label htmlFor="eq-topic" className="label">I'm enquiring about</label>
          <select id="eq-topic" name="topic" className="select" key={`t-${v.topic ?? ""}`} defaultValue={v.topic || defaultTopic}>
            {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {state && !state.ok && state.fieldErrors?.topic && <p className="field-error">{state.fieldErrors.topic}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="eq-course" className="label">Course or program <span className="font-normal text-ink-400">(optional)</span></label>
          <select id="eq-course" name="courseId" className="select" key={`c-${v.courseId ?? ""}`} defaultValue={v.courseId || defaultCourse}>
            <option value="">Not sure yet / general enquiry</option>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="label">Preferred contact method</legend>
        <div className="flex gap-6">
          {["email", "phone"].map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2 text-[0.88rem] text-ink-700">
              <input type="radio" name="preferredContact" value={m} defaultChecked={(v.preferredContact ?? "email") === m} className="accent-[#c04a12]" />
              {m === "email" ? "Email" : "Phone call"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4">
        <label htmlFor="eq-message" className="label">Message <span aria-hidden>*</span></label>
        <textarea
          id="eq-message"
          name="message"
          key={`m-${v.message ?? ""}`}
          className="textarea"
          placeholder="Tell us a little about your background and what you'd like to learn…"
          required
          defaultValue={v.message ?? ""}
        />
        {state && !state.ok && state.fieldErrors?.message && <p className="field-error">{state.fieldErrors.message}</p>}
      </div>

      <button type="submit" className="btn btn-accent mt-5 w-full sm:w-auto" disabled={pending}>
        {pending ? "Submitting…" : "Submit Enquiry"}
      </button>
      <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-400">
        Your details are used only to respond to this enquiry and are never shared or displayed publicly.
      </p>
    </form>
  );
}
