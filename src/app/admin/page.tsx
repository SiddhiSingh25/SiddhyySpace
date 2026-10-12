import Link from "next/link";
import { db } from "@/lib/db";
import { Heading } from "@/components/typography/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import {
  FileText,
  BookOpen,
  Package,
  Music,
  Sparkles,
  MessageSquare,
  Users,
  Folder,
  Tag,
  Plus,
  ArrowRight,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [
    blogs,
    draftCount,
    publishedCount,
    books,
    products,
    playlists,
    celebrations,
    categories,
    tags,
    users,
    comments,
    pendingComments,
    recentBlogs,
    recentComments,
  ] = await Promise.all([
    db.blog.count({ where: { deletedAt: null } }),
    db.blog.count({ where: { status: "DRAFT", deletedAt: null } }),
    db.blog.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    db.book.count({ where: { deletedAt: null } }),
    db.product.count({ where: { deletedAt: null } }),
    db.playlist.count({ where: { deletedAt: null } }),
    db.celebration.count({ where: { deletedAt: null } }),
    db.category.count({ where: { deletedAt: null } }),
    db.tag.count({ where: { deletedAt: null } }),
    db.user.count(),
    db.comment.count({ where: { deletedAt: null } }),
    db.comment.count({ where: { approved: false, deletedAt: null } }),
    db.blog.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    }),
    db.comment.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        user: { select: { name: true } },
        blog: { select: { title: true } },
      },
    }),
  ]);

  const cards = [
    {
      label: "Blogs",
      count: blogs,
      sub: `${publishedCount} published, ${draftCount} drafts`,
      href: "/admin/blogs",
      icon: FileText,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      label: "Books",
      count: books,
      sub: "Curated shelf & affiliate links",
      href: "/admin/books",
      icon: BookOpen,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      label: "Products",
      count: products,
      sub: "Gear & setup recommendations",
      href: "/admin/products",
      icon: Package,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      label: "Playlists",
      count: playlists,
      sub: "Spotify vibes & playlists",
      href: "/admin/playlists",
      icon: Music,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      label: "Celebrations",
      count: celebrations,
      sub: "Milestones & achievements",
      href: "/admin/celebrations",
      icon: Sparkles,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      label: "Comments",
      count: comments,
      sub:
        pendingComments > 0
          ? `⚠️ ${pendingComments} pending moderation`
          : "All moderated",
      href: "/admin/comments",
      icon: MessageSquare,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      label: "Users",
      count: users,
      sub: "Registered community members",
      href: "/admin/users",
      icon: Users,
      color: "bg-teal-50 text-teal-600 border-teal-200",
    },
    {
      label: "Categories",
      count: categories,
      sub: "Blog taxonomy & collections",
      href: "/admin/categories",
      icon: Folder,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      label: "Tags",
      count: tags,
      sub: "Cross-topic keywords",
      href: "/admin/tags",
      icon: Tag,
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading as="h1">Admin Control Center</Heading>
          <p className="mt-1 text-sm text-muted">
            Overview of your space, quick actions, content curation, and community moderation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ButtonLink href="/admin/blogs/new" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Blog
          </ButtonLink>
          <ButtonLink href="/admin/books/new" size="sm" variant="secondary">
            <Plus className="h-4 w-4 mr-1" />
            New Book
          </ButtonLink>
          <ButtonLink href="/admin/products/new" size="sm" variant="secondary">
            <Plus className="h-4 w-4 mr-1" />
            New Product
          </ButtonLink>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-link/40 no-underline"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border ${c.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-1 group-hover:text-link" />
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {c.label}
                </p>
                <p className="font-display text-3xl font-bold text-foreground mt-0.5">
                  {c.count}
                </p>
                <p className="mt-1 text-xs text-muted truncate">{c.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Blogs */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Blogs
            </h2>
            <Link
              href="/admin/blogs"
              className="text-xs font-medium text-link hover:underline no-underline"
            >
              View all blogs →
            </Link>
          </div>

          {recentBlogs.length === 0 ? (
            <p className="text-xs text-muted py-4 text-center">No blogs yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentBlogs.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/admin/blogs/${b.id}`}
                    className="text-sm font-medium text-foreground hover:text-link no-underline truncate max-w-xs"
                  >
                    {b.title}
                  </Link>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={b.status === "PUBLISHED" ? "success" : "default"}
                    >
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Comments */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              Recent Comments
            </h2>
            <Link
              href="/admin/comments"
              className="text-xs font-medium text-link hover:underline no-underline"
            >
              Moderate comments →
            </Link>
          </div>

          {recentComments.length === 0 ? (
            <p className="text-xs text-muted py-4 text-center">
              No comments yet.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recentComments.map((cm) => (
                <div
                  key={cm.id}
                  className="py-3 first:pt-0 last:pb-0 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {cm.user.name ?? "Reader"}
                    </span>
                    <span className="text-muted truncate max-w-[150px]">
                      on {cm.blog.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted line-clamp-1 italic">
                    &ldquo;{cm.content}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
