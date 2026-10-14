import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { siteConfig } from "@/config/site";
import {
  ShieldCheck,
  Eye,
  Cookie,
  Lock,
  UserCheck,
  ExternalLink,
  Mail,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy · SiddhyySpace",
  description:
    "Learn how SiddhyySpace protects your privacy, handles personal data, utilizes Google Analytics (G-LQHZ85NSZV), and manages affiliate links.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: `Privacy Policy · ${siteConfig.name}`,
    description:
      "Transparency regarding how SiddhyySpace collects, protects, and handles your data.",
    url: `${siteConfig.url}/privacy-policy`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy · ${siteConfig.name}`,
    description:
      "Transparency regarding how SiddhyySpace collects, protects, and handles your data.",
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 15, 2026";

  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur mb-5">
            <ShieldCheck className="h-3.5 w-3.5 text-link" />
            <span>Privacy & Transparency</span>
          </div>

          <Heading as="h1" className="text-balance font-display text-4xl sm:text-5xl font-medium tracking-tight">
            Privacy Policy
          </Heading>

          <Text muted className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Your trust is paramount. This policy clearly outlines what information is collected, how it is used, and how your privacy is protected while exploring SiddhyySpace.
          </Text>

          <p className="mt-3 text-xs text-muted">
            Last updated: <span className="font-medium text-foreground">{lastUpdated}</span>
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-foreground/90">
          {/* Section 1 */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <Eye className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                1. Overview & Scope
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                SiddhyySpace (accessible via <strong className="text-foreground">{siteConfig.url}</strong>) is a personal universe founded and operated by <strong className="text-foreground">Siddhi Singh</strong> for thoughtful writing, curated books, lifestyle recommendations, Spotify playlists, and community interaction.
              </p>
              <p>
                This Privacy Policy applies to all pages, services, interactive components (such as our Wall of Love and Blog Comments), and newsletter or contact touchpoints provided under this website.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <UserCheck className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                2. Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-sm text-muted leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-1">A. Information You Voluntarily Provide</h3>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-foreground">Authentication & Account Details:</strong> When you sign in using Google OAuth (NextAuth), we receive basic public profile information provided by Google, including your name, email address, and profile avatar. We do not receive or store your Google password.
                  </li>
                  <li>
                    <strong className="text-foreground">Comments & Wall of Love Notes:</strong> Any thoughts, reflections, or appreciation notes you submit on blogs or the Wall of Love are stored in our secure database along with your display name and avatar.
                  </li>
                  <li>
                    <strong className="text-foreground">Direct Messages & Inquiries:</strong> When you fill out our <Link href="/contact" className="text-link hover:underline">Contact Form</Link> or email us directly, we collect your name, email address, and message content to respond to you.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">B. Automatically Collected Technical Data</h3>
                <p>
                  When you visit the site, certain technical information is recorded automatically, such as your browser type, device category, approximate geographical location (country/city level), referring URL, pages viewed, and session duration.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Google Analytics */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <Cookie className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                3. Google Analytics (gtag.js) & Cookies
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                We use <strong className="text-foreground">Google Analytics 4</strong> (Property Tag ID: <code className="rounded bg-background px-2 py-0.5 font-mono text-xs text-foreground border border-border">G-LQHZ85NSZV</code>) to aggregate traffic metrics and understand how readers interact with articles, book spotlights, and recommendations.
              </p>
              <p>
                Google Analytics uses small text files called cookies stored on your device to collect anonymized user engagement statistics. This information helps us optimize page load performance, layout responsiveness, and content relevance.
              </p>
              <p>
                You can opt out of Google Analytics measurement at any time by configuring your browser to decline cookies, using browser privacy modes, or installing the official{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link hover:underline inline-flex items-center gap-1"
                >
                  <span>Google Analytics Opt-Out Browser Add-on</span>
                  <ExternalLink className="h-3 w-3" />
                </a>.
              </p>
            </div>
          </div>

          {/* Section 4: Affiliate Links */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <ExternalLink className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                4. Affiliate Partnerships & External Links
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                SiddhyySpace participates in affiliate marketing programs, such as Amazon Associates and retail partner platforms. Some product and book links on this site are affiliate links.
              </p>
              <p>
                When you click on an affiliate link and make a purchase on a third-party merchant site, a tracking cookie may be placed by that merchant to credit the referral to SiddhyySpace. This occurs at <strong className="text-foreground">no additional cost to you</strong>.
              </p>
              <p>
                Please note that external websites (such as Amazon, Myntra, Spotify, or YouTube) operate under their own independent privacy policies and data practices. We encourage you to review their terms when navigating outside SiddhyySpace.
              </p>
            </div>
          </div>

          {/* Section 5: Security & Storage */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <Lock className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                5. Data Retention, Security & Protection
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                We maintain appropriate administrative and technical safeguards to protect your personal information against unauthorized access, loss, alteration, or misuse. All network communication with SiddhyySpace is encrypted using HTTPS / TLS protocol.
              </p>
              <p>
                We do not sell, rent, trade, or monetize your personal information to third-party brokers or advertisers.
              </p>
            </div>
          </div>

          {/* Section 6: Your Rights */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <UserCheck className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                6. Your Rights & Choices
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                You retain complete control over your data. You have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Access or review the profile information associated with your account.</li>
                <li>Request the removal of comments or Wall of Love notes authored by you.</li>
                <li>Request complete erasure of your user profile and associated records.</li>
              </ul>
              <p>
                To make any data request or inquire about your information, please reach out directly through our <Link href="/contact" className="text-link hover:underline">Contact page</Link> or email <a href="mailto:singhsiddhi960@gmail.com" className="text-link hover:underline">singhsiddhi960@gmail.com</a>.
              </p>
            </div>
          </div>

          {/* Section 7: Contact */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-surface to-primary/10 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display text-lg font-medium text-foreground">
                Have questions about our Privacy Policy?
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                Siddhi is happy to answer any questions regarding data protection and content transparency.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href="/faq"
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground shadow-sm hover:bg-surface transition-all"
              >
                View FAQ
              </Link>
              <Link
                href="/contact"
                className="rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-background shadow-sm hover:bg-foreground/90 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
