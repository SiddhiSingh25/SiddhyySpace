import { db } from "@/lib/db";

export async function getVisibleCelebrations() {
  return db.celebration.findMany({
    where: { visible: true, deletedAt: null },
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });
}
