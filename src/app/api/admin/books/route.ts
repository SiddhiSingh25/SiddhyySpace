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

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const books = await db.book.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { author: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      affiliate: true,
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(successResponse(books));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = bookSchema.parse(await request.json());
    let slug = body.slug?.trim() || slugify(body.title);

    // ensure unique slug
    const existingSlug = await db.book.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    let affiliateId: string | null = null;
    if (body.affiliateUrl?.trim()) {
      const affiliate = await db.affiliateLink.create({
        data: {
          url: body.affiliateUrl.trim(),
          source: "book-admin",
        },
      });
      affiliateId = affiliate.id;
    }

    const book = await db.book.create({
      data: {
        title: body.title.trim(),
        author: body.author.trim(),
        slug,
        summary: body.summary?.trim() || null,
        coverImage: body.coverImage?.trim() || null,
        videoUrl: body.videoUrl?.trim() || null,
        rating: body.rating ?? null,
        featured: body.featured ?? false,
        visible: body.visible ?? true,
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

    return NextResponse.json(
      successResponse(book, "Book created successfully."),
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not create book.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
