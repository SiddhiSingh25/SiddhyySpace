import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { EmptyState } from "@/components/feedback/EmptyState";
import { getVisiblePlaylists } from "@/features/spotify/services/playlist.service";

export const metadata: Metadata = {
  title: "Playlists",
  description: "Music for focus, calm, and deep work.",
};

export const revalidate = 60;

export default async function PlaylistsPage() {
  const playlists = await getVisiblePlaylists().catch(() => []);

  return (
    <Section>
      <Container>
        <Heading as="h1">Playlists</Heading>
        <Text muted className="mt-3 max-w-2xl">
          Soundtracks for reading and making.
        </Text>
        {playlists.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="No playlists yet"
            description="Spotify playlists will appear here once added."
          />
        ) : (
          <div className="mt-10 grid gap-6">
            {playlists.map((playlist) => (
              <article
                key={playlist.id}
                className="overflow-hidden rounded-2xl border border-border bg-white"
              >
                <div className="p-5">
                  <Heading as="h2" className="text-2xl">
                    {playlist.title}
                  </Heading>
                  {playlist.description ? (
                    <Text muted className="mt-2">
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
        )}
      </Container>
    </Section>
  );
}
