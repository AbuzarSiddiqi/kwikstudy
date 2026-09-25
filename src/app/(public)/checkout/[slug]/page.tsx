import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCourseBySlug, getCourseStats, isEnrolled } from "@/lib/queries";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { CheckoutClient } from "@/components/CheckoutClient";
import { Breadcrumb } from "@/components/ui";

type Params = Promise<{ slug: string }>;

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({ params }: { params: Params }) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/checkout/${slug}`)}`);

  const course = getCourseBySlug(slug);
  if (!course) notFound();
  if (isEnrolled(user.id, course.id)) redirect("/dashboard/courses?already=1");
  if (course.status === "waitlist") redirect(`/courses/${slug}`);

  const stats = getCourseStats(course.id);
  const instructorRow = db
    .prepare("SELECT i.name FROM course_instructors ci JOIN instructors i ON i.id = ci.instructor_id WHERE ci.course_id = ? LIMIT 1")
    .get(course.id) as { name: string } | undefined;

  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { href: `/courses/${course.slug}`, label: course.title }, { label: "Checkout" }]} />
          <h1 className="mt-4 font-display text-[1.8rem] font-bold tracking-tight sm:text-[2rem]">Secure checkout</h1>
          <p className="mt-2 text-[0.9rem] text-ink-500">
            Step 2 of 2 — review your order, choose a payment method and start learning.
          </p>
        </div>
      </section>

      <section className="wrap py-12">
        <CheckoutClient
          course={{
            slug: course.slug,
            title: course.title,
            price: course.price,
            originalPrice: course.original_price,
            instructor: instructorRow?.name ?? course.instructor_name ?? "",
            coverCode: course.cover_code,
          }}
          student={{ name: user.name, email: user.email }}
        />
        <p className="mt-8 text-center text-[0.83rem] text-ink-400">
          Changed your mind? <Link href={`/courses/${course.slug}`} className="link-underline">Back to the course page</Link>.
        </p>
      </section>
    </>
  );
}
