import { db } from "@/lib/db";

export async function getVisibleProducts() {
  return db.product.findMany({
    where: { visible: true, deletedAt: null },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { affiliate: true },
  });
}

export async function getProductBySlug(slug: string) {
  return db.product.findFirst({
    where: { slug, visible: true, deletedAt: null },
    include: { affiliate: true },
  });
}

export async function getFeaturedProducts(limit = 4) {
  return db.product.findMany({
    where: { visible: true, deletedAt: null },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}
