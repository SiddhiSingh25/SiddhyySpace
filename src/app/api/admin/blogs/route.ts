import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { resolveReadingTime, slugify } from "@/utils/content";

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  content: z.unknown(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  featured: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  readingTimeOverride: z.number().int().positive().optional().nullable(),
});

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const blogs = await db.blog.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { category: true, tags: { include: { tag: true } } },
  });

  return NextResponse.json(successResponse(blogs));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = blogSchema.parse(await request.json());
    const slug = body.slug?.trim() || slugify(body.title);
    const readingTime = resolveReadingTime(
      body.content,
      body.readingTimeOverride,
    );

    const blog = await db.blog.create({
      data: {
        title: body.title,
        slug,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        content: body.content as object,
        status: body.status,
        featured: body.featured ?? false,
        categoryId: body.categoryId,
        readingTime,
        readingTimeOverride: body.readingTimeOverride,
        publishedAt: body.status === "PUBLISHED" ? new Date() : null,
        tags: body.tagIds?.length
          ? {
              create: body.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
    });

    return NextResponse.json(
      successResponse(blog, "Blog created successfully."),
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not create blog.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
