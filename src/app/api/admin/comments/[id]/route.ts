import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  approved: z.boolean(),
});

export async function PATCH(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = updateSchema.parse(await request.json());

    const comment = await db.comment.update({
      where: { id },
      data: { approved: body.approved },
    });

    return NextResponse.json(
      successResponse(comment, "Comment approval status updated."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update comment status.", [
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

  await db.comment.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(
    successResponse(null, "Comment deleted successfully."),
  );
}
