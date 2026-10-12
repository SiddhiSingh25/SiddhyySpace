"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Package,
  Music,
  Sparkles,
  Folder,
  Tag,
  Flame,
  User,
  MessageSquare,
  Users,
  Settings,
} from "lucide-react";

export const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/books", label: "Books", icon: BookOpen },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/playlists", label: "Playlists", icon: Music },
  { href: "/admin/celebrations", label: "Celebrations", icon: Sparkles },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/hero", label: "Hero", icon: Flame },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/comments", label: "Comments", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Admin">
      {adminLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition no-underline",
              isActive
                ? "bg-foreground text-white shadow-sm"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-white" : "text-muted",
              )}
            />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex overflow-x-auto gap-1 pb-2 scrollbar-none md:hidden border-b border-border bg-white px-4 pt-2">
      {adminLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition no-underline",
              isActive
                ? "bg-foreground text-white"
                : "text-muted hover:bg-surface hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
