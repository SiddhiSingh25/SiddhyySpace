import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Folder, Edit } from "lucide-react";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const categories = await db.category.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { blogs: { where: { deletedAt: null } } },
      },
    },
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Categories"
        description="Organize blog articles and stories into distinct topics."
        actionHref="/admin/categories/new"
        actionLabel="New category"
      />

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search categories…"
          className="h-11 w-full max-w-md rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link"
        />
      </form>

      {categories.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No categories yet"
          description="Create categories to structure your writings and thoughts."
          action={
            <ButtonLink href="/admin/categories/new">
              Create category
            </ButtonLink>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Slug</th>
                  <th className="px-5 py-3.5">Description</th>
                  <th className="px-5 py-3.5">Blogs Count</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="transition hover:bg-surface/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-muted border border-border">
                          <Folder className="h-4 w-4" />
                        </div>
                        <Link
                          href={`/admin/categories/${cat.id}`}
                          className="font-medium text-foreground hover:text-link transition no-underline"
                        >
                          {cat.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted">
                      {cat.slug}
                    </td>
                    <td className="px-5 py-4 text-muted text-xs max-w-xs truncate">
                      {cat.description ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-medium text-foreground border border-border">
                        {cat._count.blogs} blogs
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/categories/${cat.id}`}
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
