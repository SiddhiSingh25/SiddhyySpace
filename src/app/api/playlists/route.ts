import { NextResponse } from "next/server";
import { getVisiblePlaylists } from "@/features/spotify/services/playlist.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const revalidate = 60;

export async function GET() {
  try {
    const playlists = await getVisiblePlaylists();
    return NextResponse.json(successResponse(playlists));
  } catch (err) {
    return NextResponse.json(
      errorResponse("Failed to fetch playlists.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 500 },
    );
  }
}
