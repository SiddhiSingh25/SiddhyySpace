import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { AdminNav, AdminMobileNav } from "@/features/admin/components/AdminNav";
import { ExternalLink } from "lucide-react";

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
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col md:flex-row">
        {/* Mobile Header and Bar */}
        <div className="md:hidden border-b border-border bg-white px-4 py-3 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="font-display text-base font-semibold text-foreground no-underline"
            >
              {siteConfig.name}
            </Link>
            <span className="ml-2 rounded bg-surface px-1.5 py-0.5 text-[10px] font-bold text-muted border border-border">
              ADMIN
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground no-underline"
          >
            Visit site <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        <AdminMobileNav />

        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-border bg-white p-5 md:block">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="font-display text-lg font-semibold text-foreground no-underline"
              >
                {siteConfig.name}
              </Link>
              <p className="text-xs text-muted">Admin Control</p>
            </div>
            <Link
              href="/"
              title="Visit live site"
              className="p-1 text-muted hover:text-foreground transition rounded-lg hover:bg-surface no-underline"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6">
            <AdminNav />
          </div>
        </aside>

        {/* Content area */}
        <main className="flex-1 p-4 sm:p-8 max-w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
