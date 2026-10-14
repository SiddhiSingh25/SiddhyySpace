import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { EmptyState } from "@/components/feedback/EmptyState";
import { getVisiblePlaylists } from "@/features/spotify/services/playlist.service";
import { AestheticPlaylistShowcase } from "@/components/playlist/AestheticPlaylistShowcase";
import { formatSpotifyEmbedUrl } from "@/features/spotify/utils";

export const metadata: Metadata = {
  title: "Playlists",
  description: "Music for focus, calm, and deep work.",
};

export const revalidate = 60;

export default async function PlaylistsPage() {
  const playlists = await getVisiblePlaylists().catch(() => []);
  const featuredPlaylist = playlists[0] ?? null;
  const additionalPlaylists = playlists.slice(1);

  return (
    <Section className="relative overflow-hidden bg-linear-to-br from-[#ffffff] via-[#f7f9fd] to-[#e4ebfc]">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 bg-[#d3defa]/40 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 bg-[#4a62b0]/15 rounded-full blur-3xl" />
      <Container>
        <div className="mb-10 text-center md:text-left">
          <Heading as="h1" className="text-4xl font-serif font-bold tracking-tight">
            Playlists
          </Heading>
          <Text muted className="mt-3 max-w-2xl text-lg">
            Curated soundtracks for reading, focus, and quiet inspiration.
          </Text>
        </div>

        {/* No playlists at all */}
        {playlists.length === 0 ? (
          <EmptyState
            className="mt-6"
            title="No playlists yet"
            description="Curated soundtracks will appear here soon. Check back later."
          />
        ) : (
          <>
            {/* Retro Aesthetic Main Showcase */}
            <div className="my-8">
              <AestheticPlaylistShowcase playlist={featuredPlaylist} />
            </div>

            {/* Additional Playlists Grid */}
            {additionalPlaylists.length > 0 && (
              <div className="mt-16 space-y-6">
                <Heading as="h2" className="text-2xl font-serif">
                  More Playlists
                </Heading>
                <div className="grid gap-6 md:grid-cols-2">
                  {additionalPlaylists.map((playlist) => (
                    <article
                      key={playlist.id}
                      className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="p-5">
                        <Heading as="h3" className="text-xl font-semibold">
                          {playlist.title}
                        </Heading>
                        {playlist.description ? (
                          <Text muted className="mt-2 text-sm">
                            {playlist.description}
                          </Text>
                        ) : null}
                      </div>
                      <iframe
                        title={playlist.title}
                        src={formatSpotifyEmbedUrl(playlist.embedUrl)}
                        className="h-40 w-full"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
