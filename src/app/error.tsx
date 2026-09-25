"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-4">Something went wrong</p>
      <h1 className="font-display text-[1.9rem] font-bold tracking-tight">An unexpected error occurred.</h1>
      <p className="mt-3 max-w-md text-[0.93rem] leading-relaxed text-ink-500">
        {error.digest
          ? `Reference: ${error.digest}. `
          : ""}
        Please try again — if the problem persists, contact support@kwikstudy.in.
      </p>
      <button onClick={reset} className="btn btn-primary mt-7">Try again</button>
    </div>
  );
}
