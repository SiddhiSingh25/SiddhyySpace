import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { FileText, Edit, Film } from "lucide-react";
import { isVideoUrl, isDirectVideoUrl } from "@/utils/media";
import { DeleteBlogButton } from "./DeleteBlogButton";

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
    <div className="space-y-6">
      <AdminHeader
        title="Blogs"
        description="Write, publish, and manage your articles and stories."
        actionHref="/admin/blogs/new"
        actionLabel="New blog"
      />

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search blogs by title or excerpt…"
          className="h-11 w-full max-w-md rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link"
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
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Blog</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Updated</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="transition hover:bg-surface/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {blog.coverImage ? (
                          isVideoUrl(blog.coverImage) ? (
                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-black text-rose-400 border border-border overflow-hidden">
                              {isDirectVideoUrl(blog.coverImage) ? (
                                <video
                                  src={blog.coverImage}
                                  muted
                                  className="h-full w-full object-cover opacity-80"
                                />
                              ) : null}
                              <Film className="absolute h-4 w-4 text-white drop-shadow" />
                            </div>
                          ) : (
                            <img
                              src={blog.coverImage}
                              alt={blog.title}
                              className="h-11 w-11 rounded-lg object-cover shadow-sm border border-border/50 shrink-0"
                            />
                          )
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface text-muted border border-border">
                            <FileText className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/blogs/${blog.id}`}
                            className="font-medium text-foreground hover:text-link transition no-underline block"
                          >
                            {blog.title}
                          </Link>
                          {blog.excerpt ? (
                            <p className="text-xs text-muted line-clamp-1 max-w-sm mt-0.5">
                              {blog.excerpt}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        variant={blog.status === "PUBLISHED" ? "success" : "outline"}
                      >
                        {blog.status === "PUBLISHED" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      {blog.category?.name ? (
                        <span className="rounded-lg bg-surface px-2 py-1 text-xs font-medium text-foreground border border-border">
                          {blog.category.name}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted text-xs">
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blogs/${blog.id}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-link hover:text-link-hover p-1.5 rounded-lg hover:bg-surface transition no-underline"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        <DeleteBlogButton id={blog.id} title={blog.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
