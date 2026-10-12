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

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const tag = await db.tag.findFirst({
    where: { id, deletedAt: null },
    include: {
      _count: {
        select: { blogs: true, books: true },
      },
    },
  });

  if (!tag) {
    return NextResponse.json(errorResponse("Tag not found."), { status: 404 });
  }

  return NextResponse.json(successResponse(tag));
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = tagSchema.parse(await request.json());
    const existing = await db.tag.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(errorResponse("Tag not found."), {
        status: 404,
      });
    }

    const slug = body.slug?.trim() || slugify(body.name);

    const tag = await db.tag.update({
      where: { id },
      data: {
        name: body.name.trim(),
        slug,
      },
    });

    return NextResponse.json(
      successResponse(tag, "Tag updated successfully."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update tag.", [
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

  await db.tag.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(successResponse(null, "Tag deleted successfully."));
}
