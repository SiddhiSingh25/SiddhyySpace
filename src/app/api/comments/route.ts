import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

const createSchema = z.object({
  blogId: z.string().min(1),
  content: z.string().min(1).max(2000),
  parentId: z.string().optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");
  if (!blogId) {
    return NextResponse.json(errorResponse("blogId is required."), {
      status: 400,
    });
  }

  const comments = await db.comment.findMany({
    where: {
      blogId,
      deletedAt: null,
      approved: true,
      parentId: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, image: true } },
      replies: {
        where: { deletedAt: null, approved: true },
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true, image: true } } },
      },
    },
  });

  return NextResponse.json(successResponse(comments));
}

export async function POST(request: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  try {
    const body = createSchema.parse(await request.json());
    const comment = await db.comment.create({
      data: {
        blogId: body.blogId,
        content: body.content.trim(),
        userId: session!.user.id,
        parentId: body.parentId,
      },
    });
    return NextResponse.json(
      successResponse(comment, "Comment posted successfully."),
      { status: 201 },
    );
  } catch {
    return NextResponse.json(errorResponse("Could not post comment."), {
      status: 400,
    });
  }
}
