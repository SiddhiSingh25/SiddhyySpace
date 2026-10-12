import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { slugify } from "@/utils/content";

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

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const playlists = await db.playlist.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(successResponse(playlists));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = playlistSchema.parse(await request.json());
    let slug = body.slug?.trim() || slugify(body.title);

    const existingSlug = await db.playlist.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const playlist = await db.playlist.create({
      data: {
        title: body.title.trim(),
        slug,
        description: body.description?.trim() || null,
        embedUrl: body.embedUrl.trim(),
        image: body.image?.trim() || null,
        category: body.category?.trim() || null,
        featured: body.featured ?? false,
        visible: body.visible ?? true,
      },
    });

    return NextResponse.json(
      successResponse(playlist, "Playlist created successfully."),
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not create playlist.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
