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
      <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#d3defa55_55%,#ffffff_100%)]">
        <Container className="flex min-h-[78vh] flex-col justify-center py-16 sm:py-20">
          <p className="mb-4 text-sm uppercase tracking-[0.18em] text-muted">
            Personal brand platform
          </p>
          <Heading as="h1" className="max-w-3xl text-balance">
            {hero?.headline ?? siteConfig.name}
          </Heading>
          <Text className="mt-5 max-w-xl text-lg text-muted">
            {hero?.subheading ?? siteConfig.description}
          </Text>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={hero?.ctaHref || "/blogs"} size="lg">
              {hero?.ctaLabel || "Read the latest"}
            </ButtonLink>
            <ButtonLink href="/books" variant="outline" size="lg">
              Explore books
            </ButtonLink>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <Heading as="h2">About</Heading>
          <Text className="mt-4 max-w-2xl text-muted">
            {about?.biography ??
              "This is a calm space for writing, recommendations, and documenting the journey — quietly and with care."}
          </Text>
        </Container>
      </Section>

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

      {playlists[0] ? (
        <Section className="bg-surface/40">
          <Container>
            <Heading as="h2">{playlists[0].title}</Heading>
            {playlists[0].description ? (
              <Text muted className="mt-3 max-w-2xl">
                {playlists[0].description}
              </Text>
            ) : null}
            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">
              <iframe
                title={playlists[0].title}
                src={playlists[0].embedUrl}
                className="h-40 w-full"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          </Container>
        </Section>
      ) : null}

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
    </>
  );
}
