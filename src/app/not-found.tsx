import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-4">Error 404</p>
      <h1 className="font-display text-[2rem] font-bold tracking-tight">This page isn't on the syllabus.</h1>
      <p className="mt-3 max-w-md text-[0.93rem] leading-relaxed text-ink-500">
        The page you're looking for may have been moved or never existed. Try the course catalogue — or head back
        home.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back to home</Link>
        <Link href="/courses" className="btn btn-outline">Browse courses</Link>
      </div>
    </div>
  );
}
