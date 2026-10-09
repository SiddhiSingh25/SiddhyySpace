import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import {
  getApprovedNotes,
  createNote,
} from "@/features/wall-of-love/services/wall-of-love.service";

const noteSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(400, "Message is too long (max 400 characters)"),
  theme: z.enum(["purple", "emerald", "violet", "rose", "amber", "cyan"]).optional().default("purple"),
  icon: z.enum(["sparkles", "bolt", "heart", "smile", "pencil", "star"]).optional().default("sparkles"),
});

export async function GET() {
  try {
    const notes = await getApprovedNotes();
    return NextResponse.json(successResponse(notes));
  } catch (error) {
    return NextResponse.json(errorResponse("Failed to fetch Wall of Love notes."), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  try {
    const json = await request.json();
    const body = noteSchema.parse(json);

    const note = await createNote({
      userId: session!.user.id,
      content: body.content,
      theme: body.theme,
      icon: body.icon,
    });

    return NextResponse.json(
      successResponse(note, "Your message has been posted on the Wall of Love! ✨"),
      { status: 201 }
    );
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(errorResponse(err.issues[0]?.message || "Invalid input."), {
        status: 400,
      });
    }
    return NextResponse.json(errorResponse("Could not post your note. Please try again."), {
      status: 500,
    });
  }
}
