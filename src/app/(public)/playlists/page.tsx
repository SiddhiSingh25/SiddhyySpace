import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { getVisiblePlaylists } from "@/features/spotify/services/playlist.service";
import { AestheticPlaylistShowcase } from "@/components/playlist/AestheticPlaylistShowcase";

export const metadata: Metadata = {
  title: "Playlists",
  description: "Music for focus, calm, and deep work.",
};

export const revalidate = 60;

export default async function PlaylistsPage() {
  const playlists = await getVisiblePlaylists().catch(() => []);
  const featuredPlaylist = playlists[0] || null;

  return (
    <Section>
      <Container>
        <div className="mb-10 text-center md:text-left">
          <Heading as="h1" className="text-4xl font-serif font-bold tracking-tight">
            Playlists
          </Heading>
          <Text muted className="mt-3 max-w-2xl text-lg">
            Curated soundtracks for reading, focus, and quiet inspiration.
          </Text>
        </div>

        {/* Retro Aesthetic Main Showcase */}
        <div className="my-8">
          <AestheticPlaylistShowcase playlist={featuredPlaylist} />
        </div>

        {/* Additional Playlists Grid if more than 1 */}
        {playlists.length > 1 && (
          <div className="mt-16 space-y-6">
            <Heading as="h2" className="text-2xl font-serif">
              More Playlists
            </Heading>
            <div className="grid gap-6 md:grid-cols-2">
              {playlists.slice(1).map((playlist) => (
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
                    src={playlist.embedUrl}
                    className="h-40 w-full"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </article>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
