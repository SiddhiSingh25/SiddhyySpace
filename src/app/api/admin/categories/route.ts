import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { slugify } from "@/utils/content";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const categories = await db.category.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          blogs: { where: { deletedAt: null } },
        },
      },
    },
  });

  return NextResponse.json(successResponse(categories));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = categorySchema.parse(await request.json());
    let slug = body.slug?.trim() || slugify(body.name);

    const existingSlug = await db.category.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const category = await db.category.create({
      data: {
        name: body.name.trim(),
        slug,
        description: body.description?.trim() || null,
      },
    });

    return NextResponse.json(
      successResponse(category, "Category created successfully."),
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not create category.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
