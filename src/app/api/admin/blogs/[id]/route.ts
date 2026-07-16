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
  status: z.enum(["DRAFT", "PUBLISHED"]),
  featured: z.boolean().optional(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
  readingTimeOverride: z.number().int().positive().optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const blog = await db.blog.findFirst({
    where: { id, deletedAt: null },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!blog) {
    return NextResponse.json(errorResponse("Blog not found."), { status: 404 });
  }

  return NextResponse.json(successResponse(blog));
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = blogSchema.parse(await request.json());
    const existing = await db.blog.findFirst({ where: { id, deletedAt: null } });
    if (!existing) {
      return NextResponse.json(errorResponse("Blog not found."), {
        status: 404,
      });
    }

    const slug = body.slug?.trim() || slugify(body.title);
    const readingTime = resolveReadingTime(
      body.content,
      body.readingTimeOverride,
    );

    await db.blogTag.deleteMany({ where: { blogId: id } });

    const blog = await db.blog.update({
      where: { id },
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
        publishedAt:
          body.status === "PUBLISHED"
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
        tags: body.tagIds?.length
          ? { create: body.tagIds.map((tagId) => ({ tagId })) }
          : undefined,
      },
    });

    return NextResponse.json(successResponse(blog, "Blog updated."));
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update blog.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  await db.blog.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(successResponse(null, "Blog deleted."));
}
