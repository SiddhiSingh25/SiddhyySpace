import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg">{siteConfig.name}</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/blogs" className="text-foreground no-underline">
            Blogs
          </Link>
          <Link href="/books" className="text-foreground no-underline">
            Books
          </Link>
          <Link href="/products" className="text-foreground no-underline">
            Products
          </Link>
          <Link href="/playlists" className="text-foreground no-underline">
            Playlists
          </Link>
        </div>
      </Container>
    </footer>
  );
}
