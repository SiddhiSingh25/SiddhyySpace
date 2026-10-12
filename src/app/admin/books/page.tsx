import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, Star, ExternalLink, Edit } from "lucide-react";

export default async function AdminBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const books = await db.book.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { author: { contains: q, mode: "insensitive" } },
              { summary: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      affiliate: true,
      tags: { include: { tag: true } },
    },
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Books"
        description="Curate your reading library, ratings, and affiliate links."
        actionHref="/admin/books/new"
        actionLabel="New book"
      />

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search books by title, author, or summary…"
          className="h-11 w-full max-w-md rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link"
        />
      </form>

      {books.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No books added yet"
          description="Start building your curated bookshelf for your readers."
          action={<ButtonLink href="/admin/books/new">Add first book</ButtonLink>}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Book</th>
                  <th className="px-5 py-3.5">Author</th>
                  <th className="px-5 py-3.5">Rating</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Tags</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {books.map((book) => (
                  <tr key={book.id} className="transition hover:bg-surface/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-12 w-9 rounded-md object-cover shadow-sm border border-border/50 shrink-0"
                          />
                        ) : (
                          <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md bg-surface text-muted border border-border">
                            <BookOpen className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/books/${book.id}`}
                            className="font-medium text-foreground hover:text-link transition no-underline block"
                          >
                            {book.title}
                          </Link>
                          {book.affiliate?.url ? (
                            <a
                              href={book.affiliate.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-muted hover:text-link mt-0.5 no-underline"
                            >
                              Affiliate link <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted font-medium">
                      {book.author}
                    </td>
                    <td className="px-5 py-4">
                      {book.rating ? (
                        <div className="flex items-center gap-1 font-medium text-amber-600">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{book.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {book.visible ? (
                          <Badge variant="success">Visible</Badge>
                        ) : (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                        {book.featured ? (
                          <Badge variant="info">Featured</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {book.tags.length > 0
                          ? book.tags.map((bt) => (
                              <span
                                key={bt.tag.id}
                                className="rounded bg-surface px-1.5 py-0.5 text-xs text-muted border border-border"
                              >
                                {bt.tag.name}
                              </span>
                            ))
                          : <span className="text-muted">—</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/books/${book.id}`}
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
