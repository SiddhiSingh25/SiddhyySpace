import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Tag as TagIcon, Edit } from "lucide-react";

export default async function AdminTagsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const tags = await db.tag.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          blogs: true,
          books: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Tags"
        description="Cross-cutting keywords for filtering blogs and books."
        actionHref="/admin/tags/new"
        actionLabel="New tag"
      />

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search tags…"
          className="h-11 w-full max-w-md rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link"
        />
      </form>

      {tags.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No tags yet"
          description="Create tags like #minimalism, #productivity, #reading to label your work."
          action={<ButtonLink href="/admin/tags/new">Create tag</ButtonLink>}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Tag</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Blog Mentions</th>
                  <th className="px-5 py-3.5">Book Mentions</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tags.map((tag) => (
                  <tr key={tag.id} className="transition hover:bg-surface/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-muted border border-border">
                          <TagIcon className="h-4 w-4" />
                        </div>
                        <Link
                          href={`/admin/tags/${tag.id}`}
                          className="font-medium text-foreground hover:text-link transition no-underline"
                        >
                          {tag.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted">
                      #{tag.slug}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="rounded-full bg-surface px-2.5 py-0.5 font-medium text-foreground border border-border">
                        {tag._count.blogs} blogs
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="rounded-full bg-surface px-2.5 py-0.5 font-medium text-foreground border border-border">
                        {tag._count.books} books
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/tags/${tag.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-link hover:text-link-hover p-1.5 rounded-lg hover:bg-surface transition no-underline"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Link>
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
