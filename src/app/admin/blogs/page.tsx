import Link from "next/link";
import { db } from "@/lib/db";
import { Heading } from "@/components/typography/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/feedback/EmptyState";

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const blogs = await db.blog.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { excerpt: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading as="h1">Blogs</Heading>
        <ButtonLink href="/admin/blogs/new">New blog</ButtonLink>
      </div>

      <form className="mt-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search blogs…"
          className="h-11 w-full max-w-md rounded-xl border border-border bg-white px-3 text-sm"
        />
      </form>

      {blogs.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No blogs yet"
          description="Create your first article to start publishing."
          action={<ButtonLink href="/admin/blogs/new">Create blog</ButtonLink>}
        />
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface/60">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="font-medium text-foreground no-underline hover:text-link"
                    >
                      {blog.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{blog.status}</td>
                  <td className="px-4 py-3">{blog.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    {blog.updatedAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
