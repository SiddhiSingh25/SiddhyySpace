import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BookCard } from "@/features/books/components/BookCard";
import { getVisibleBooks } from "@/features/books/services/book.service";

export const metadata: Metadata = {
  title: "Books",
  description: "Books worth reading slowly.",
};

export const revalidate = 60;

export default async function BooksPage() {
  const books = await getVisibleBooks().catch(() => []);

  return (
    <Section>
      <Container>
        <Heading as="h1">Books</Heading>
        <Text muted className="mt-3 max-w-2xl">
          Recommendations with context — not just titles.
        </Text>
        {books.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="No books yet"
            description="Book recommendations will appear here soon."
          />
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
