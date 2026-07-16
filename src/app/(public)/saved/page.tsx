import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BlogCard } from "@/features/blog/components/BlogCard";

export const metadata: Metadata = {
  title: "Saved",
};

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const saved = await db.savedPost.findMany({
    where: { userId: session.user.id },
    include: { blog: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Section>
      <Container>
        <Heading as="h1">Saved articles</Heading>
        <Text muted className="mt-3">
          Pieces you want to revisit.
        </Text>
        {saved.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="Nothing saved yet"
            description="Start exploring and save the ones you want to revisit."
          />
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {saved.map((item) => (
              <BlogCard key={item.id} blog={item.blog} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
