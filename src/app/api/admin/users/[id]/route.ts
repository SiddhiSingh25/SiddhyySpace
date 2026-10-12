import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

const userRoleSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = userRoleSchema.parse(await request.json());

    // Prevent removing admin from yourself to avoid accidental lockout
    if (session?.user.id === id && body.role !== "ADMIN") {
      return NextResponse.json(
        errorResponse("You cannot remove admin privileges from yourself."),
        { status: 400 },
      );
    }

    const user = await db.user.update({
      where: { id },
      data: { role: body.role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      successResponse(user, `User role updated to ${body.role}.`),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update user role.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
