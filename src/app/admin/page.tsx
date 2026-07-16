import { db } from "@/lib/db";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

export default async function AdminDashboardPage() {
  const [blogs, users, comments, likes, draftCount, publishedCount] =
    await Promise.all([
      db.blog.count({ where: { deletedAt: null } }),
      db.user.count(),
      db.comment.count({ where: { deletedAt: null } }),
      db.like.count(),
      db.blog.count({ where: { status: "DRAFT", deletedAt: null } }),
      db.blog.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    ]);

  const stats = [
    { label: "Blogs", value: blogs },
    { label: "Published", value: publishedCount },
    { label: "Drafts", value: draftCount },
    { label: "Users", value: users },
    { label: "Comments", value: comments },
    { label: "Likes", value: likes },
  ];

  return (
    <div>
      <Heading as="h1">Dashboard</Heading>
      <Text muted className="mt-2">
        A quiet overview of what&apos;s happening.
      </Text>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-white p-5 shadow-soft"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 font-display text-3xl">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
