import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { slugify } from "@/utils/content";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
});

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const tags = await db.tag.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          blogs: true,
          books: true,
        },
      },
    },
  });

  return NextResponse.json(successResponse(tags));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = tagSchema.parse(await request.json());
    let slug = body.slug?.trim() || slugify(body.name);

    const existingSlug = await db.tag.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const tag = await db.tag.create({
      data: {
        name: body.name.trim(),
        slug,
      },
    });

    return NextResponse.json(
      successResponse(tag, "Tag created successfully."),
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not create tag.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
