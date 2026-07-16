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
  title: "Profile",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [liked, comments] = await Promise.all([
    db.like.findMany({
      where: { userId: session.user.id },
      include: { blog: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.comment.findMany({
      where: { userId: session.user.id, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return (
    <Section>
      <Container>
        <Heading as="h1">{session.user.name ?? "Your profile"}</Heading>
        <Text muted className="mt-2">
          {session.user.email}
        </Text>

        <div className="mt-12">
          <Heading as="h2">Liked articles</Heading>
          {liked.length === 0 ? (
            <EmptyState
              className="mt-6"
              title="No likes yet"
              description="Articles you like will appear here."
            />
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {liked.map((item) => (
                <BlogCard key={item.id} blog={item.blog} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <Heading as="h2">Your comments</Heading>
          {comments.length === 0 ? (
            <EmptyState
              className="mt-6"
              title="No comments yet"
              description="Thoughtful notes you leave on articles will show up here."
            />
          ) : (
            <ul className="mt-6 space-y-3">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="rounded-xl border border-border bg-surface/50 p-4"
                >
                  <p className="text-sm">{comment.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
