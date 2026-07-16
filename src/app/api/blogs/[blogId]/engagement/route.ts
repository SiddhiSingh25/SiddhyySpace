import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";

type Params = { params: Promise<{ blogId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { blogId } = await params;
  const session = await auth();

  try {
    const likes = await db.like.count({ where: { blogId } });

    if (!session?.user?.id) {
      return NextResponse.json(
        successResponse({ liked: false, saved: false, likes }),
      );
    }

    const [liked, saved] = await Promise.all([
      db.like.findUnique({
        where: {
          blogId_userId: { blogId, userId: session.user.id },
        },
      }),
      db.savedPost.findUnique({
        where: {
          blogId_userId: { blogId, userId: session.user.id },
        },
      }),
    ]);

    return NextResponse.json(
      successResponse({
        liked: !!liked,
        saved: !!saved,
        likes,
      }),
    );
  } catch {
    return NextResponse.json(errorResponse("Could not load engagement."), {
      status: 500,
    });
  }
}
