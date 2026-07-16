import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getBookBySlug } from "@/features/books/services/book.service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug).catch(() => null);
  if (!book) return { title: "Book not found" };
  return {
    title: book.title,
    description: book.summary ?? undefined,
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const book = await getBookBySlug(slug).catch(() => null);
  if (!book) notFound();

  return (
    <Section>
      <Container className="grid gap-10 md:grid-cols-[240px_1fr]">
        <div
          className="aspect-[3/4] rounded-2xl bg-primary/40"
          style={
            book.coverImage
              ? {
                  backgroundImage: `url(${book.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
        <div>
          <Heading as="h1">{book.title}</Heading>
          <Text muted className="mt-2">
            {book.author}
            {book.rating != null ? ` · ${book.rating.toFixed(1)} / 5` : ""}
          </Text>
          {book.summary ? (
            <Text className="mt-6 whitespace-pre-wrap">{book.summary}</Text>
          ) : null}
          {book.affiliate?.url ? (
            <ButtonLink
              href={book.affiliate.url}
              className="mt-8"
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              View book
            </ButtonLink>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
