import Link from "next/link";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

type BookCardProps = {
  book: {
    slug: string;
    title: string;
    author: string;
    coverImage: string | null;
    summary: string | null;
    rating: number | null;
  };
};

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/books/${book.slug}`} className="block no-underline">
        <div
          className="aspect-[3/4] bg-primary/40"
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
        <div className="space-y-1.5 p-4">
          <Heading as="h3" className="text-lg text-foreground">
            {book.title}
          </Heading>
          <Text muted className="text-sm">
            {book.author}
          </Text>
          {book.rating != null ? (
            <p className="text-xs text-muted">{book.rating.toFixed(1)} / 5</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
