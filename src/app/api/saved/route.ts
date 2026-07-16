import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

const schema = z.object({
  blogId: z.string().min(1),
});

export async function POST(request: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  try {
    const body = schema.parse(await request.json());
    const existing = await db.savedPost.findUnique({
      where: {
        blogId_userId: {
          blogId: body.blogId,
          userId: session!.user.id,
        },
      },
    });

    if (existing) {
      await db.savedPost.delete({ where: { id: existing.id } });
      return NextResponse.json(
        successResponse({ saved: false }, "Removed from saved."),
      );
    }

    await db.savedPost.create({
      data: { blogId: body.blogId, userId: session!.user.id },
    });
    return NextResponse.json(successResponse({ saved: true }, "Saved."));
  } catch {
    return NextResponse.json(errorResponse("Could not update saved posts."), {
      status: 400,
    });
  }
}
