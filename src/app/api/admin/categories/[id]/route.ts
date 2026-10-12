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

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const category = await db.category.findFirst({
    where: { id, deletedAt: null },
    include: {
      _count: {
        select: { blogs: { where: { deletedAt: null } } },
      },
    },
  });

  if (!category) {
    return NextResponse.json(errorResponse("Category not found."), {
      status: 404,
    });
  }

  return NextResponse.json(successResponse(category));
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = categorySchema.parse(await request.json());
    const existing = await db.category.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(errorResponse("Category not found."), {
        status: 404,
      });
    }

    const slug = body.slug?.trim() || slugify(body.name);

    const category = await db.category.update({
      where: { id },
      data: {
        name: body.name.trim(),
        slug,
        description: body.description?.trim() || null,
      },
    });

    return NextResponse.json(
      successResponse(category, "Category updated successfully."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update category.", [
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

  await db.category.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(
    successResponse(null, "Category deleted successfully."),
  );
}
