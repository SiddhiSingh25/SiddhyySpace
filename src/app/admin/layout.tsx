import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/playlists", label: "Playlists" },
  { href: "/admin/celebrations", label: "Celebrations" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-surface/40">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-white p-5 md:block">
          <Link
            href="/"
            className="font-display text-lg text-foreground no-underline"
          >
            {siteConfig.name}
          </Link>
          <p className="mt-1 text-xs text-muted">Admin</p>
          <nav className="mt-8 space-y-1" aria-label="Admin">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm text-foreground no-underline hover:bg-primary/40",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
