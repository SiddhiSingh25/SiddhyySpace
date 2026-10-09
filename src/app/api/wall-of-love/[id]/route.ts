import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { deleteNote } from "@/features/wall-of-love/services/wall-of-love.service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(errorResponse("Note ID is required."), {
        status: 400,
      });
    }

    const isAdmin = session?.user.role === "ADMIN";
    await deleteNote(id, session!.user.id, isAdmin);

    return NextResponse.json(successResponse(null, "Note deleted successfully."));
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete note.";
    return NextResponse.json(errorResponse(message), {
      status: 400,
    });
  }
}
