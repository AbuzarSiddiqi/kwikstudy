"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function updateEnquiryStatus(enquiryId: string, status: "new" | "contacted" | "closed") {
  await requireAdmin();
  if (!["new", "contacted", "closed"].includes(status)) return;
  db.prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(status, enquiryId);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
