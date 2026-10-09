import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { BookCard } from "@/features/books/components/BookCard";
import { getFeaturedBlogs } from "@/features/blog/services/blog.service";
import { getActiveHero } from "@/features/hero/services/hero.service";
import { getActiveAbout } from "@/features/about/services/about.service";
import { getFeaturedBooks } from "@/features/books/services/book.service";
import { getFeaturedPlaylists } from "@/features/spotify/services/playlist.service";
import { getVisibleCelebrations } from "@/features/celebration/services/celebration.service";
import { siteConfig } from "@/config/site";
import { format } from "date-fns";
import Home from "./home/home";
import { FloatingText } from "@/components/ui/FloatingText";
import avatar from "@/assets/profile/profile.png"
import About from "./home/about";


import EnvelopeSection from "./home/Envelop";
import WallOfLove from "./home/wallOfLove";


import { AestheticPlaylistShowcase } from "@/components/playlist/AestheticPlaylistShowcase";

export const revalidate = 60;

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [hero, about, blogs, books, playlists, celebrations] =
    await Promise.all([
      safe(() => getActiveHero(), null),
      safe(() => getActiveAbout(), null),
      safe(() => getFeaturedBlogs(3), []),
      safe(() => getFeaturedBooks(4), []),
      safe(() => getFeaturedPlaylists(1), []),
      safe(() => getVisibleCelebrations(), []),
    ]);

  return (
    <>
      <Home />
      <About />

      <Section className="bg-surface/40">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <Heading as="h2">Featured writing</Heading>
            <ButtonLink href="/blogs" variant="ghost" size="sm">
              View all
            </ButtonLink>
          </div>
          {blogs.length === 0 ? (
            <EmptyState
              title="No stories yet"
              description="Published blogs will appear here once the admin publishes the first piece."
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} featured={index === 0} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <Heading as="h2">Book recommendations</Heading>
            <ButtonLink href="/books" variant="ghost" size="sm">
              Browse books
            </ButtonLink>
          </div>
          {books.length === 0 ? (
            <EmptyState
              title="Books coming soon"
              description="Recommended books will show up here after they're added in the admin."
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* Retro Aesthetic Playlist Section on Home Route */}
      <Section className="py-12">
        <Container>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <Heading as="h2">Playlists</Heading>
              <Text muted className="mt-1">
                Soundtracks for reading and making.
              </Text>
            </div>
            <ButtonLink href="/playlists" variant="ghost" size="sm">
              View all playlists
            </ButtonLink>
          </div>
          <AestheticPlaylistShowcase playlist={playlists[0] || null} />
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading as="h2">Celebrations</Heading>
          <Text muted className="mt-3 max-w-2xl">
            Small milestones along the way.
          </Text>
          {celebrations.length === 0 ? (
            <EmptyState
              className="mt-8"
              title="No milestones yet"
              description="Timeline moments will appear once celebrations are added."
            />
          ) : (
            <ol className="mt-10 space-y-6 border-l border-border pl-6">
              {celebrations.slice(0, 4).map((item) => (
                <li key={item.id} className="relative">
                  <span className="absolute -left-[1.91rem] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-xs uppercase tracking-wide text-muted">
                    {format(item.date, "MMM yyyy")}
                  </p>
                  <Heading as="h3" className="mt-1 text-xl">
                    {item.title}
                  </Heading>
                  {item.description ? (
                    <Text muted className="mt-1">
                      {item.description}
                    </Text>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </Container>
      </Section>

      <WallOfLove />

      <EnvelopeSection />
    </>
  );
}


