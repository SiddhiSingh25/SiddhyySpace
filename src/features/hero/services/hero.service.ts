import { db } from "@/lib/db";

export async function getActiveHero() {
  return db.hero.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
  });
}
