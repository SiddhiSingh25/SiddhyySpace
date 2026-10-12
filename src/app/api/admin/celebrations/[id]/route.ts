import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

const celebrationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  date: z.string().or(z.date()),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const celebration = await db.celebration.findFirst({
    where: { id, deletedAt: null },
  });

  if (!celebration) {
    return NextResponse.json(errorResponse("Celebration not found."), {
      status: 404,
    });
  }

  return NextResponse.json(successResponse(celebration));
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = celebrationSchema.parse(await request.json());
    const existing = await db.celebration.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(errorResponse("Celebration not found."), {
        status: 404,
      });
    }

    const celebration = await db.celebration.update({
      where: { id },
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        image: body.image?.trim() || null,
        date: new Date(body.date),
        order: body.order,
        visible: body.visible,
      },
    });

    return NextResponse.json(
      successResponse(celebration, "Celebration updated successfully."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update celebration.", [
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

  await db.celebration.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(
    successResponse(null, "Celebration deleted successfully."),
  );
}
