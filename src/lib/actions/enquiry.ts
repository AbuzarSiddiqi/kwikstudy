"use server";

import { db } from "@/lib/db";
import { newId } from "@/lib/auth-core";

export type EnquiryState =
  | { ok: true; message: string }
  | { ok: false; fieldErrors?: Record<string, string>; error?: string; values?: Record<string, string> }
  | null;

const TOPICS = ["Course enquiry", "Fees & offers", "Batches", "Corporate training", "Career programs", "General"];

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const topic = String(formData.get("topic") ?? "General");
  const courseId = String(formData.get("courseId") ?? "") || null;
  const preferredContact = String(formData.get("preferredContact") ?? "email");
  const message = String(formData.get("message") ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Please enter your full name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address";
  if (phone && !/^[+\d][\d\s-]{6,14}$/.test(phone)) fieldErrors.phone = "Enter a valid phone number";
  if (!TOPICS.includes(topic)) fieldErrors.topic = "Choose a topic";
  if (message.length < 10) fieldErrors.message = "Tell us a little more (at least 10 characters)";
  if (message.length > 2000) fieldErrors.message = "Message is too long";
  if (!["email", "phone"].includes(preferredContact)) fieldErrors.preferredContact = "Choose how we should reach you";

  if (courseId) {
    const course = db.prepare("SELECT id FROM courses WHERE id = ? AND status = 'published'").get(courseId);
    if (!course) fieldErrors.courseId = "Select a valid course";
  }
  const values = { name, email, phone, topic, message, courseId: courseId ?? "", preferredContact };
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors, values };

  try {
    db.prepare(
      "INSERT INTO enquiries (id, name, email, phone, topic, course_id, preferred_contact, message, status, created_at) VALUES (?,?,?,?,?,?,?,?, 'new', ?)"
    ).run(newId("enq"), name, email, phone || null, topic, courseId, preferredContact, message, new Date().toISOString());
  } catch {
    return { ok: false, error: "Something went wrong while submitting your enquiry. Please try again.", values };
  }

  return {
    ok: true,
    message: "Thank you. Your enquiry has reached our academic team — we usually respond within one working day.",
  };
}
