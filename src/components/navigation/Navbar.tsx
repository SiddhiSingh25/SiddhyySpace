import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/blogs", label: "Blogs" },
  { href: "/books", label: "Books" },
  { href: "/products", label: "Products" },
  { href: "/playlists", label: "Playlists" },
  { href: "/celebrations", label: "Celebrations" },
];

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl text-foreground no-underline"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/80 no-underline hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link
                href="/saved"
                className="hidden text-sm text-foreground no-underline sm:inline"
              >
                Saved
              </Link>
              <Link
                href="/profile"
                className="text-sm text-foreground no-underline"
              >
                Profile
              </Link>
              {session.user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="text-sm text-link no-underline"
                >
                  Admin
                </Link>
              ) : null}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="ghost" size="sm">
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <Button type="submit" size="sm">
                Sign in
              </Button>
            </form>
          )}
        </div>
      </Container>
    </header>
  );
}
