/* CLI: reset and reseed the local database.
   The same seeding logic runs automatically on the server when no database
   exists yet (see src/lib/db.ts). */

import { db } from "@/lib/db";
import { seedDatabase } from "@/db/seed";

seedDatabase(db);

const count = (table: string) => (db.prepare(`SELECT COUNT(*) n FROM ${table}`).get() as { n: number }).n;

console.log("Seed complete:", {
  categories: count("course_categories"),
  instructors: count("instructors"),
  users: count("users"),
  courses: count("courses"),
  modules: count("modules"),
  lessons: count("lessons"),
  quizzes: count("quizzes"),
  assignments: count("assignments"),
  programs: count("programs"),
  enrollments: count("enrollments"),
  progress: count("lesson_progress"),
  certificates: count("certificates"),
});
