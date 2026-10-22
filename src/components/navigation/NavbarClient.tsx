"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Session } from "next-auth";
import {
  BookOpen,
  BookMarked,
  ShoppingBag,
  Headphones,
  PartyPopper,
  Bookmark,
  User,
  ShieldCheck,
  LogOut,
  LogIn,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { ClockBadge } from "@/components/navigation/ClockBadge";
import { signOutAction, signInAction } from "@/components/navigation/nav-actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/blogs", label: "Blogs", icon: BookOpen },
  { href: "/books", label: "Books", icon: BookMarked },
  { href: "/products", label: "Products", icon: ShoppingBag },
  { href: "/playlists", label: "Playlists", icon: Headphones },
  { href: "/celebrations", label: "Celebrations", icon: PartyPopper },
];

type NavbarClientProps = {
  session: Session | null;
};

export function NavbarClient({ session }: NavbarClientProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for silky navbar elevation transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  // Escape key listener to close open menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  // Initials fallback for user avatar
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 ease-out",
        isScrolled
          ? "border-b border-border/80 bg-background/90 shadow-[0_4px_20px_rgba(27,28,27,0.04)] backdrop-blur-md"
          : "border-b border-border/50 bg-background/75 backdrop-blur-sm"
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 no-underline"
          aria-label={`${siteConfig.name} Home`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/40 text-foreground transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/70 group-hover:shadow-xs">
            <Sparkles className="h-4 w-4 text-link transition-transform duration-300 group-hover:rotate-12" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-link sm:text-2xl">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Central Navigation with silky gliding hover pill */}
        <nav
          className="hidden md:flex items-center gap-1 rounded-full border border-border/70 bg-surface/60 p-1 shadow-2xs backdrop-blur-md"
          aria-label="Main Navigation"
        >
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium no-underline transition-colors duration-200",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted hover:text-foreground"
                )}
              >
                {/* Gliding animated hover pill */}
                {hoveredLink === link.href && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-background/90 shadow-xs border border-border/60"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}

                {/* Active indicator pill (when not actively hovered over another item) */}
                {isActive && !hoveredLink && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-background shadow-xs border border-border/80"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}

                <Icon
                  className={cn(
                    "relative z-10 h-3.5 w-3.5 transition-transform duration-200",
                    isActive ? "text-link scale-105" : "text-muted"
                  )}
                />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Time Badge, User Actions, Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Clock badge with live pulse */}
          <ClockBadge className="hidden sm:inline-flex" />

          {/* Authenticated User Menu */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              {/* Quick Saved link on wider desktop */}
              <div className="flex items-center gap-1.5">
                <Link
                  href="/saved"
                  className={cn(
                    "hidden lg:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium no-underline transition-all duration-200",
                    pathname === "/saved"
                      ? "bg-primary/40 text-foreground font-semibold"
                      : "text-muted hover:bg-surface hover:text-foreground"
                  )}
                  title="Saved Articles & Books"
                >
                  <Bookmark className="h-3.5 w-3.5 text-link" />
                  <span>Saved</span>
                </Link>

                {/* Profile Trigger Button */}
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border border-border/80 bg-surface/70 py-1 pl-1 pr-2.5 text-xs font-medium text-foreground transition-all duration-200 hover:border-link/40 hover:bg-surface hover:shadow-xs focus-visible:outline-2 focus-visible:outline-link",
                    userMenuOpen && "border-link/60 bg-surface shadow-xs ring-2 ring-primary/40"
                  )}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User account menu"
                >
                  {/* User Avatar */}
                  <span className="relative flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/60 text-xs font-semibold text-foreground ring-1 ring-border">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User Avatar"}
                        width={28}
                        height={28}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{getInitials(user.name)}</span>
                    )}
                  </span>

                  <span className="hidden xl:inline max-w-[90px] truncate text-left text-xs font-medium">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>

                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 text-muted transition-transform duration-250",
                      userMenuOpen && "rotate-180 text-foreground"
                    )}
                  />
                </button>
              </div>

              {/* Silky Animated User Popover Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 6 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/80 bg-background/95 p-2 shadow-xl backdrop-blur-xl z-50 origin-top-right"
                  >
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 rounded-xl bg-surface/60 p-2.5">
                      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/60 text-sm font-semibold text-foreground ring-1 ring-border">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User Avatar"}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{getInitials(user.name)}</span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-foreground">
                          {user.name || "Reader"}
                        </p>
                        <p className="truncate text-[11px] text-muted">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-primary/50 px-1.5 py-0.5 text-[10px] font-semibold text-link uppercase tracking-wider">
                            <ShieldCheck className="h-3 w-3" />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="my-1.5 border-t border-border/60" />

                    {/* Nav Actions */}
                    <div className="space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium no-underline transition-colors",
                          pathname === "/profile"
                            ? "bg-primary/30 text-foreground font-semibold"
                            : "text-muted hover:bg-surface hover:text-foreground"
                        )}
                      >
                        <User className="h-4 w-4 text-muted" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/saved"
                        onClick={() => setUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium no-underline transition-colors",
                          pathname === "/saved"
                            ? "bg-primary/30 text-foreground font-semibold"
                            : "text-muted hover:bg-surface hover:text-foreground"
                        )}
                      >
                        <Bookmark className="h-4 w-4 text-muted" />
                        <span>Saved Items</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium no-underline transition-colors",
                            pathname.startsWith("/admin")
                              ? "bg-primary/40 text-link font-semibold"
                              : "text-link hover:bg-primary/20"
                          )}
                        >
                          <ShieldCheck className="h-4 w-4 text-link" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="my-1.5 border-t border-border/60" />

                    {/* Log out button with icon and silky hover */}
                    <form action={signOutAction} className="w-full">
                      <button
                        type="submit"
                        className="group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-danger transition-colors duration-150 hover:bg-danger/10"
                      >
                        <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                        <span>Log out</span>
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Sign in action button with icon */
            <form action={signInAction}>
              <button
                type="submit"
                className="group relative inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background shadow-xs transition-all duration-200 hover:bg-foreground/90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Sign in with Google"
              >
                <LogIn className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                <span>Sign in</span>
              </button>
            </form>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-surface/80 text-foreground transition-all duration-200 hover:bg-surface hover:text-link md:hidden focus-visible:outline-2 focus-visible:outline-link"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </Container>

      {/* Silky Responsive Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-16 bg-foreground/20 backdrop-blur-xs md:hidden z-40"
              aria-hidden="true"
            />

            {/* Mobile Sheet Content */}
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 top-full overflow-hidden border-b border-border/80 bg-background/95 shadow-2xl backdrop-blur-2xl md:hidden z-50 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <Container className="py-5 space-y-5">
                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    Explore
                  </p>
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                      pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(`${link.href}/`));

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group flex items-center justify-between rounded-xl p-2.5 text-sm font-medium no-underline transition-all duration-150",
                          isActive
                            ? "bg-primary/30 text-foreground font-semibold border border-primary/50 shadow-2xs"
                            : "text-muted hover:bg-surface hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                              isActive
                                ? "bg-primary text-foreground"
                                : "bg-surface text-muted group-hover:text-foreground group-hover:bg-primary/30"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span>{link.label}</span>
                        </div>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform group-hover:translate-x-0.5",
                            isActive ? "text-link" : "text-muted/60"
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile User Section */}
                <div className="rounded-2xl border border-border/70 bg-surface/50 p-3.5 space-y-3">
                  {user ? (
                    <>
                      {/* User Profile Info Card */}
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/60 text-sm font-semibold text-foreground ring-2 ring-primary/40">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || "User Avatar"}
                              width={44}
                              height={44}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span>{getInitials(user.name)}</span>
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {user.name || "Reader"}
                            </p>
                            {isAdmin && (
                              <span className="inline-flex items-center gap-0.5 rounded bg-primary/60 px-1.5 py-0.5 text-[10px] font-semibold text-link uppercase">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-muted">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Quick Links inside Mobile Card */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Link
                          href="/profile"
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/80 p-2 text-xs font-medium no-underline transition-colors",
                            pathname === "/profile"
                              ? "border-link/40 bg-primary/20 text-foreground font-semibold"
                              : "text-muted hover:text-foreground hover:bg-background"
                          )}
                        >
                          <User className="h-3.5 w-3.5 text-muted" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          href="/saved"
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/80 p-2 text-xs font-medium no-underline transition-colors",
                            pathname === "/saved"
                              ? "border-link/40 bg-primary/20 text-foreground font-semibold"
                              : "text-muted hover:text-foreground hover:bg-background"
                          )}
                        >
                          <Bookmark className="h-3.5 w-3.5 text-link" />
                          <span>Saved</span>
                        </Link>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/20 p-2 text-xs font-semibold text-link no-underline transition-colors hover:bg-primary/30"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      {/* Log out button with icon */}
                      <form action={signOutAction} className="pt-1">
                        <button
                          type="submit"
                          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-danger/20 bg-danger/5 py-2.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
                        >
                          <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                          <span>Log out</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    /* Guest card with sign in button */
                    <div className="space-y-3 py-1">
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          Welcome to {siteConfig.name}
                        </p>
                        <p className="text-[11px] text-muted">
                          Sign in to bookmark favorite essays, books, and leave comments.
                        </p>
                      </div>
                      <form action={signInAction}>
                        <button
                          type="submit"
                          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-xs font-semibold text-background shadow-xs transition-all duration-200 hover:bg-foreground/90 hover:shadow-md cursor-pointer"
                        >
                          <LogIn className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          <span>Sign in with Google</span>
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Mobile Drawer Footer with clock & quick help */}
                <div className="flex flex-col gap-3 pt-2 text-xs text-muted border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px]">Current Time</span>
                    <ClockBadge compact={false} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-muted/80">
                    <Link
                      href="/contact"
                      onClick={() => setMobileOpen(false)}
                      className="hover:text-foreground no-underline"
                    >
                      Contact
                    </Link>
                    <span>·</span>
                    <Link
                      href="/faq"
                      onClick={() => setMobileOpen(false)}
                      className="hover:text-foreground no-underline"
                    >
                      FAQ
                    </Link>
                    <span>·</span>
                    <Link
                      href="/privacy-policy"
                      onClick={() => setMobileOpen(false)}
                      className="hover:text-foreground no-underline"
                    >
                      Privacy
                    </Link>
                    <span>·</span>
                    <Link
                      href="/terms-and-conditions"
                      onClick={() => setMobileOpen(false)}
                      className="hover:text-foreground no-underline"
                    >
                      Terms
                    </Link>
                  </div>
                </div>
              </Container>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
