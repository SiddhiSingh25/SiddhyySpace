import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api-response";
import { likeNote } from "@/features/wall-of-love/services/wall-of-love.service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(errorResponse("Note ID is required."), {
        status: 400,
      });
    }

    const updatedNote = await likeNote(id);
    return NextResponse.json(successResponse(updatedNote, "Liked!"));
  } catch {
    return NextResponse.json(errorResponse("Failed to update like count."), {
      status: 500,
    });
  }
}
