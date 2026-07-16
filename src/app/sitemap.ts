import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/blogs",
    "/books",
    "/products",
    "/playlists",
    "/celebrations",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const [blogs, books, products] = await Promise.all([
      db.blog.findMany({
        where: { status: "PUBLISHED", deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      db.book.findMany({
        where: { visible: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
      db.product.findMany({
        where: { visible: true, deletedAt: null },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...blogs.map((blog) => ({
        url: `${base}/blogs/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...books.map((book) => ({
        url: `${base}/books/${book.slug}`,
        lastModified: book.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...products.map((product) => ({
        url: `${base}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
