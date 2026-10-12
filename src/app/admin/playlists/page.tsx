import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { Music, ExternalLink, Edit } from "lucide-react";

export default async function AdminPlaylistsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

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

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Playlists"
        description="Manage aesthetic Spotify and music embeds shared across the space."
        actionHref="/admin/playlists/new"
        actionLabel="New playlist"
      />

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search playlists by title or mood/category…"
          className="h-11 w-full max-w-md rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link"
        />
      </form>

      {playlists.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No playlists yet"
          description="Curate Spotify tunes and study soundtracks for visitors."
          action={
            <ButtonLink href="/admin/playlists/new">Add first playlist</ButtonLink>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Playlist</th>
                  <th className="px-5 py-3.5">Category / Mood</th>
                  <th className="px-5 py-3.5">Embed Preview</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {playlists.map((pl) => (
                  <tr key={pl.id} className="transition hover:bg-surface/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {pl.image ? (
                          <img
                            src={pl.image}
                            alt={pl.title}
                            className="h-11 w-11 rounded-lg object-cover shadow-sm border border-border/50 shrink-0"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <Music className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/playlists/${pl.id}`}
                            className="font-medium text-foreground hover:text-link transition no-underline block"
                          >
                            {pl.title}
                          </Link>
                          {pl.description ? (
                            <p className="text-xs text-muted line-clamp-1 max-w-sm">
                              {pl.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {pl.category ? (
                        <span className="rounded-lg bg-surface px-2 py-1 text-xs font-medium text-foreground border border-border">
                          {pl.category}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 max-w-xs truncate text-xs text-muted">
                      <a
                        href={pl.embedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-link no-underline"
                      >
                        <span className="truncate max-w-[200px]">{pl.embedUrl}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {pl.visible ? (
                          <Badge variant="success">Visible</Badge>
                        ) : (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                        {pl.featured ? (
                          <Badge variant="info">Featured</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/playlists/${pl.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-link hover:text-link-hover p-1.5 rounded-lg hover:bg-surface transition no-underline"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
