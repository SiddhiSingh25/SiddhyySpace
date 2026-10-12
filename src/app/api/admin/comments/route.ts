import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { successResponse } from "@/lib/api-response";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const filter = searchParams.get("filter"); // 'all' | 'approved' | 'pending'

  const comments = await db.comment.findMany({
    where: {
      deletedAt: null,
      ...(filter === "approved" ? { approved: true } : {}),
      ...(filter === "pending" ? { approved: false } : {}),
      ...(q
        ? {
            OR: [
              { content: { contains: q, mode: "insensitive" } },
              { user: { name: { contains: q, mode: "insensitive" } } },
              { user: { email: { contains: q, mode: "insensitive" } } },
              { blog: { title: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
      blog: {
        select: { id: true, title: true, slug: true },
      },
    },
  });

  return NextResponse.json(successResponse(comments));
}
