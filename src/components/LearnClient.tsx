"use client";

import { useEffect, useState, useTransition } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { toggleLessonComplete, pingLessonView, submitAssignment, type AssignmentState } from "@/lib/actions/learn";
import { Check, ArrowLeft, ArrowRight, Alert } from "@/components/Icons";

/** Fire-and-forget view ping so "continue learning" stays accurate. */
export function ViewPing({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    pingLessonView(lessonId).catch(() => {});
  }, [lessonId]);
  return null;
}

export function LessonCompleteButton({ lessonId, completed }: { lessonId: string; completed: boolean }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(completed);

  useEffect(() => setDone(completed), [completed]);

  return (
    <button
      onClick={() => {
        const next = !done;
        setDone(next); // optimistic
        startTransition(async () => {
          const res = await toggleLessonComplete(lessonId, next);
          if (!res?.ok) setDone(!next); // revert on failure
        });
      }}
      disabled={pending}
      aria-pressed={done}
      className={`btn btn-sm ${done ? "btn-outline !text-moss-600" : "btn-primary"}`}
    >
      <Check width={15} height={15} />
      {done ? "Completed" : pending ? "Marking…" : "Mark complete"}
    </button>
  );
}

export function LessonFooterNav({
  prev, next, lessonId, completed, isPreview,
}: {
  prev: { href: string; title: string } | null;
  next: { href: string; title: string } | null;
  lessonId: string;
  completed: boolean;
  isPreview: boolean;
}) {
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6" aria-label="Lesson navigation">
      {prev ? (
        <Link href={prev.href} className="group flex items-center gap-3 text-left">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-500 transition-colors group-hover:border-accent-500 group-hover:text-accent-700">
            <ArrowLeft width={16} height={16} />
          </span>
          <span>
            <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-ink-400">Previous</span>
            <span className="block max-w-[11rem] truncate font-display text-[0.85rem] font-semibold text-ink-800 group-hover:text-accent-700">{prev.title}</span>
          </span>
        </Link>
      ) : <span />}

      {!isPreview && <LessonCompleteButton lessonId={lessonId} completed={completed} />}

      {next ? (
        <Link href={next.href} className="group flex items-center gap-3 text-right">
          <span>
            <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-ink-400">Next</span>
            <span className="block max-w-[11rem] truncate font-display text-[0.85rem] font-semibold text-ink-800 group-hover:text-accent-700">{next.title}</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-500 transition-colors group-hover:border-accent-500 group-hover:text-accent-700">
            <ArrowRight width={16} height={16} />
          </span>
        </Link>
      ) : <span />}
    </nav>
  );
}

export function AssignmentSubmitForm({ lessonId, alreadySubmitted }: { lessonId: string; alreadySubmitted: boolean }) {
  const [state, action, pending] = useActionState<AssignmentState, FormData>(submitAssignment, null);

  if (state?.ok) {
    return (
      <div className="rounded-[10px] border border-moss-100 bg-moss-50 px-5 py-4 text-[0.88rem] font-medium text-moss-700" role="status">
        <p className="flex items-center gap-2"><Check width={16} height={16} /> Submission received — this lesson is marked complete.</p>
        <p className="mt-1 font-normal text-moss-600">Your instructor reviews submissions within one working day.</p>
      </div>
    );
  }

  return (
    <form action={action} className="card p-6">
      <h3 className="font-display text-[1rem] font-semibold">Submit your work</h3>
      <p className="mb-4 mt-1 text-[0.83rem] text-ink-500">
        Paste your code or a repository link, and describe your approach in a few sentences.
      </p>
      {state && !state.ok && state.error && (
        <p className="mb-4 flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-2.5 text-[0.83rem] font-medium text-accent-700" role="alert">
          <Alert width={15} height={15} /> {state.error}
        </p>
      )}
      <input type="hidden" name="lessonId" value={lessonId} />
      <textarea
        name="notes"
        className="textarea font-mono !text-[0.83rem]"
        placeholder={alreadySubmitted ? "Update your submission…" : "Repository link or pasted code, plus 3–4 sentences on your approach…"}
        defaultValue={alreadySubmitted ? "Your previous submission is saved — submit again to replace it." : ""}
        required
      />
      <button type="submit" className="btn btn-accent mt-4" disabled={pending}>
        {pending ? "Submitting…" : alreadySubmitted ? "Update submission" : "Submit assignment"}
      </button>
    </form>
  );
}
