import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { Mail, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/80 bg-surface/60 backdrop-blur">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-3">
            <Link
              href="/"
              className="font-display text-2xl font-medium tracking-tight text-foreground no-underline hover:opacity-90 transition-opacity"
            >
              {siteConfig.name}
            </Link>
            <p className="max-w-sm text-sm text-muted leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-muted">
              <Mail className="h-3.5 w-3.5 text-link" />
              <a
                href="mailto:singhsiddhi960@gmail.com"
                className="text-foreground hover:text-link hover:underline transition-colors"
              >
                singhsiddhi960@gmail.com
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Explore
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/blogs"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Writing & Essays
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Books & Reading Lists
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Curated Products
                </Link>
              </li>
              <li>
                <Link
                  href="/playlists"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Spotify Playlists
                </Link>
              </li>
              <li>
                <Link
                  href="/celebrations"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Celebrations & Milestones
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Help */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Help & Legal
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-muted hover:text-foreground no-underline transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-12 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-danger fill-danger" />
            <span>for thoughtful living</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
