import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { slugify } from "@/utils/content";
import { formatSpotifyEmbedUrl } from "@/features/spotify/utils";

const playlistSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  embedUrl: z.string().min(1, "Embed URL is required"),
  image: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const playlist = await db.playlist.findFirst({
    where: { id, deletedAt: null },
  });

  if (!playlist) {
    return NextResponse.json(errorResponse("Playlist not found."), {
      status: 404,
    });
  }

  return NextResponse.json(successResponse(playlist));
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = playlistSchema.parse(await request.json());
    const existing = await db.playlist.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return NextResponse.json(errorResponse("Playlist not found."), {
        status: 404,
      });
    }

    const slug = body.slug?.trim() || slugify(body.title);

    const playlist = await db.playlist.update({
      where: { id },
      data: {
        title: body.title.trim(),
        slug,
        description: body.description?.trim() || null,
        embedUrl: formatSpotifyEmbedUrl(body.embedUrl),
        image: body.image?.trim() || null,
        category: body.category?.trim() || null,
        featured: body.featured,
        visible: body.visible,
      },
    });

    return NextResponse.json(
      successResponse(playlist, "Playlist updated successfully."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update playlist.", [
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

  await db.playlist.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(
    successResponse(null, "Playlist deleted successfully."),
  );
}
