import { db } from "@/lib/db";

export async function getFeaturedBlogs(limit = 3) {
  return db.blog.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: limit,
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
}

export async function getPublishedBlogs() {
  return db.blog.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });
}

export async function getBlogBySlug(slug: string) {
  return db.blog.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: {
      category: true,
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true, saved: true } },
    },
  });
}

export async function getRelatedBlogs(blogId: string, categoryId?: string | null) {
  return db.blog.findMany({
    where: {
      id: { not: blogId },
      status: "PUBLISHED",
      deletedAt: null,
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: { category: true },
  });
}
