import { db } from "@/lib/db";

export async function getActiveAbout() {
  return db.about.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
}
