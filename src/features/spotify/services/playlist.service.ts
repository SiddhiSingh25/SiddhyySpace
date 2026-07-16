import { db } from "@/lib/db";

export async function getVisiblePlaylists() {
  return db.playlist.findMany({
    where: { visible: true, deletedAt: null },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getFeaturedPlaylists(limit = 2) {
  return db.playlist.findMany({
    where: { visible: true, deletedAt: null },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}
