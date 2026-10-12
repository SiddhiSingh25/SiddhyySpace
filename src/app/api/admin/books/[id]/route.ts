import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { slugify } from "@/utils/content";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  slug: z.string().optional(),
  summary: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  rating: z.number().min(0).max(5).optional().nullable(),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  tagIds: z.array(z.string()).optional(),
  affiliateUrl: z.string().optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const book = await db.book.findFirst({
    where: { id, deletedAt: null },
    include: {
      affiliate: true,
      tags: { include: { tag: true } },
    },
  });

  if (!book) {
    return NextResponse.json(errorResponse("Book not found."), { status: 404 });
  }

  return NextResponse.json(successResponse(book));
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = bookSchema.parse(await request.json());
    const existing = await db.book.findFirst({
      where: { id, deletedAt: null },
      include: { affiliate: true },
    });

    if (!existing) {
      return NextResponse.json(errorResponse("Book not found."), {
        status: 404,
      });
    }

    const slug = body.slug?.trim() || slugify(body.title);

    let affiliateId = existing.affiliateId;
    if (body.affiliateUrl !== undefined) {
      if (body.affiliateUrl?.trim()) {
        if (existing.affiliateId) {
          await db.affiliateLink.update({
            where: { id: existing.affiliateId },
            data: { url: body.affiliateUrl.trim() },
          });
        } else {
          const affiliate = await db.affiliateLink.create({
            data: {
              url: body.affiliateUrl.trim(),
              source: "book-admin",
            },
          });
          affiliateId = affiliate.id;
        }
      } else {
        affiliateId = null;
      }
    }

    // Replace tags
    await db.bookTag.deleteMany({ where: { bookId: id } });

    const book = await db.book.update({
      where: { id },
      data: {
        title: body.title.trim(),
        author: body.author.trim(),
        slug,
        summary: body.summary?.trim() || null,
        coverImage: body.coverImage?.trim() || null,
        videoUrl: body.videoUrl?.trim() || null,
        rating: body.rating ?? null,
        featured: body.featured,
        visible: body.visible,
        affiliateId,
        tags: body.tagIds?.length
          ? {
              create: body.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
      include: {
        affiliate: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(successResponse(book, "Book updated successfully."));
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update book.", [
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

  await db.book.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(successResponse(null, "Book deleted successfully."));
}
