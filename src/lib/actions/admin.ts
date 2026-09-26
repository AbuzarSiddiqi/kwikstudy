"use server";

import { revalidatePath } from "next/cache";
import { setEnquiryStatus } from "@/lib/queries";
import { requireAdmin } from "@/lib/session";

export async function updateEnquiryStatus(enquiryId: string, status: "new" | "contacted" | "closed") {
  await requireAdmin();
  if (!["new", "contacted", "closed"].includes(status)) return;
  setEnquiryStatus(enquiryId, status);
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
