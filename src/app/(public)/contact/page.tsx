import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { EmailCopyButton } from "@/features/contact/components/EmailCopyButton";
import { siteConfig } from "@/config/site";
import {
  Mail,
  Clock,
  Sparkles,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us · SiddhyySpace",
  description:
    "For any queries, collaborations, book discussions, or questions, reach out to Siddhi Singh directly at singhsiddhi960@gmail.com.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact Us · ${siteConfig.name}`,
    description:
      "Reach out to Siddhi Singh for any queries, recommendations, or brand partnerships.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Contact Us · ${siteConfig.name}`,
    description:
      "Reach out to Siddhi Singh for any queries, recommendations, or brand partnerships.",
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Siddhi Singh",
  url: `${siteConfig.url}/contact`,
  description:
    "Contact information for SiddhyySpace and Siddhi Singh for queries, feedback, and brand partnerships.",
  mainEntity: {
    "@type": "Person",
    name: "Siddhi Singh",
    email: "singhsiddhi960@gmail.com",
    url: siteConfig.url,
  },
};

export default function ContactPage() {
  const emailAddress = "singhsiddhi960@gmail.com";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />

      <Section className="py-12 sm:py-16 lg:py-24">
        <Container className="max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur mb-5">
              <Mail className="h-3.5 w-3.5 text-link" />
              <span>Direct Inquiries</span>
            </div>

            <Heading as="h1" className="text-balance font-display text-4xl sm:text-5xl font-medium tracking-tight">
              Contact Us
            </Heading>

            <Text muted className="mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              For any queries, feedback, brand collaborations, or questions, feel free to reach out directly to Siddhi via email.
            </Text>
          </div>

          {/* Main Prominent Email Box */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-surface to-background p-8 sm:p-12 text-center shadow-soft backdrop-blur space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-link border border-primary/30">
              <Mail className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                Official Email Address
              </p>
              <a
                href={`mailto:${emailAddress}`}
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground hover:text-link transition-colors block break-all no-underline"
              >
                {emailAddress}
              </a>
            </div>

            <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
              Have questions regarding book reviews, lifestyle recommendations, sponsored features, or just want to connect? My inbox is always open.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${emailAddress}`}
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm hover:bg-foreground/90 transition-all no-underline cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span>Send an Email</span>
              </a>
              <EmailCopyButton email={emailAddress} />
            </div>
          </div>

          {/* Context & FAQs row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-border/70 bg-surface/70 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-link">
                <Clock className="h-3.5 w-3.5" />
                <span>Response Time</span>
              </div>
              <p className="text-sm text-foreground font-medium">Within 24–48 Hours</p>
              <p className="text-xs text-muted leading-relaxed">
                Every email is read personally. Please expect a reply within one to two business days.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-surface/70 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-link">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Quick Answers</span>
              </div>
              <p className="text-sm text-foreground font-medium">Frequently Asked Questions</p>
              <p className="text-xs text-muted leading-relaxed">
                Check our{" "}
                <Link href="/faq" className="text-link hover:underline font-medium">
                  FAQ page
                </Link>{" "}
                for details on affiliate transparency, review guidelines, and more.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
