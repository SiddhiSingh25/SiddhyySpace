import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Calendar, Edit } from "lucide-react";

export default async function AdminCelebrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const celebrations = await db.celebration.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Celebrations"
        description="Celebrate life milestones, project launches, achievements, and special memories."
        actionHref="/admin/celebrations/new"
        actionLabel="New celebration"
      />

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search celebrations…"
          className="h-11 w-full max-w-md rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link"
        />
      </form>

      {celebrations.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No celebrations yet"
          description="Log milestones, birthdays, launch days, and proud moments."
          action={
            <ButtonLink href="/admin/celebrations/new">
              Add first celebration
            </ButtonLink>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Milestone</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Display Order</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {celebrations.map((item) => (
                  <tr key={item.id} className="transition hover:bg-surface/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-11 w-11 rounded-lg object-cover shadow-sm border border-border/50 shrink-0"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                            <Sparkles className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/celebrations/${item.id}`}
                            className="font-medium text-foreground hover:text-link transition no-underline block"
                          >
                            {item.title}
                          </Link>
                          {item.description ? (
                            <p className="text-xs text-muted line-clamp-1 max-w-md">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-muted" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted">
                      #{item.order}
                    </td>
                    <td className="px-5 py-4">
                      {item.visible ? (
                        <Badge variant="success">Visible</Badge>
                      ) : (
                        <Badge variant="outline">Hidden</Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/celebrations/${item.id}`}
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
