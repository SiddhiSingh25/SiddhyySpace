import { db } from "@/lib/db";

export async function getVisibleBooks() {
  return db.book.findMany({
    where: { visible: true, deletedAt: null },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { affiliate: true, tags: { include: { tag: true } } },
  });
}

export async function getBookBySlug(slug: string) {
  return db.book.findFirst({
    where: { slug, visible: true, deletedAt: null },
    include: { affiliate: true, tags: { include: { tag: true } } },
  });
}

export async function getFeaturedBooks(limit = 4) {
  return db.book.findMany({
    where: { visible: true, deletedAt: null },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}
