import { notFound, redirect } from "next/navigation";
import { getCourseBySlug, getCurriculum, getCourseProgress } from "@/lib/queries";
import { requireUser } from "@/lib/session";
import { isEnrolled } from "@/lib/queries";

export default async function LearnEntry({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const user = await requireUser();
  const course = getCourseBySlug(slug);
  if (!course) notFound();
  if (!isEnrolled(user.id, course.id)) redirect(`/courses/${slug}`);

  const progress = getCourseProgress(user.id, course.id);
  if (progress.currentLessonId) redirect(`/learn/${slug}/${progress.currentLessonId}`);

  const curriculum = getCurriculum(course.id);
  const first = curriculum[0]?.lessons[0];
  if (!first) redirect(`/courses/${slug}`);
  redirect(`/learn/${slug}/${first.id}`);
}
