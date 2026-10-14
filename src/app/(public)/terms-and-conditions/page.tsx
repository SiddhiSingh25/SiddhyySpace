import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { siteConfig } from "@/config/site";
import {
  Scale,
  FileCheck2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions · SiddhyySpace",
  description:
    "Review the Terms and Conditions for using SiddhyySpace, including community guidelines, content ownership, and affiliate transparency.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: `Terms and Conditions · ${siteConfig.name}`,
    description:
      "Guidelines, content copyright, and policies governing the use of SiddhyySpace.",
    url: `${siteConfig.url}/terms-and-conditions`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Terms and Conditions · ${siteConfig.name}`,
    description:
      "Guidelines, content copyright, and policies governing the use of SiddhyySpace.",
  },
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "October 15, 2026";

  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur mb-5">
            <Scale className="h-3.5 w-3.5 text-link" />
            <span>Usage Agreement</span>
          </div>

          <Heading as="h1" className="text-balance font-display text-4xl sm:text-5xl font-medium tracking-tight">
            Terms & Conditions
          </Heading>

          <Text muted className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Welcome to SiddhyySpace. These terms define the rules and guidelines governing your access to and use of our writing, curation, and community features.
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
              <FileCheck2 className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                1. Acceptance of Terms
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                By visiting, browsing, or interacting with <strong className="text-foreground">SiddhyySpace</strong> (<code className="text-foreground">{siteConfig.url}</code>), you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions and our <Link href="/privacy-policy" className="text-link hover:underline">Privacy Policy</Link>.
              </p>
              <p>
                If you do not agree with any part of these terms, please discontinue browsing the website.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <Sparkles className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                2. Intellectual Property Rights
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                All original content featured on this platform—including essays, articles, personal photography, artwork, book reviews, graphics, logos, and UI designs—is the exclusive intellectual property of <strong className="text-foreground">Siddhi Singh</strong>, protected by applicable copyright, trademark, and intellectual property laws.
              </p>
              <p>
                You may quote brief excerpts or share links with appropriate credit and direct back-links to SiddhyySpace. You may not republish, distribute, scrape, or monetize full articles, images, or assets without prior written consent.
              </p>
            </div>
          </div>

          {/* Section 3: Community Guidelines */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                3. User Contributions & Community Standards
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                SiddhyySpace offers community features including the Wall of Love and Blog Comments. When participating, you agree to uphold a supportive, respectful, and mindful atmosphere.
              </p>
              <p>
                You agree not to post or transmit:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Harassing, defamatory, offensive, discriminatory, or unlawful content.</li>
                <li>Commercial spam, chain letters, automated scripts, or unauthorized advertisements.</li>
                <li>Content that infringes on any third party&apos;s copyright, privacy, or proprietary rights.</li>
              </ul>
              <p>
                SiddhyySpace reserves the right to review, edit, reject, or remove any comment or note at its sole discretion to preserve community integrity.
              </p>
            </div>
          </div>

          {/* Section 4: Affiliate & Recommendations Disclosure */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <AlertCircle className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                4. Affiliate Disclosure & Product Recommendations
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                In compliance with advertising standards and consumer protection guidelines, please note that SiddhyySpace participates in affiliate programs, including Amazon Associates and fashion/lifestyle partnerships.
              </p>
              <p>
                When you click through our affiliate links and make a purchase, SiddhyySpace may earn a small referral commission at <strong className="text-foreground">no additional cost to you</strong>.
              </p>
              <p>
                Every recommendation reflects genuine personal affinity, careful curation, and honest editorial opinion. However, we do not manufacture or sell these products directly. You are encouraged to verify warranty, price, delivery, and return policies directly with the merchant retailer prior to purchasing.
              </p>
            </div>
          </div>

          {/* Section 5: Informational Disclaimer */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <ShieldAlert className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                5. Non-Professional Advice Disclaimer
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                All materials published on SiddhyySpace—including skincare recommendations, wellness reflections, lifestyle habits, and productivity tips—are published strictly for informational, educational, and inspirational purposes.
              </p>
              <p>
                They do not substitute for professional medical, dermatological, financial, or legal counsel. Always consult qualified professionals regarding personal healthcare, skincare routines, or dietary needs.
              </p>
            </div>
          </div>

          {/* Section 6: Third-Party Links */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <ExternalLink className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                6. Third-Party Integrations & External Websites
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                Our site includes embedded media players (such as Spotify playlists and YouTube video reviews) and links to external merchants or reading platforms.
              </p>
              <p>
                SiddhyySpace does not control and is not liable for the availability, terms, content, or practices of external platforms. Your interactions with third-party sites are governed solely by their respective terms.
              </p>
            </div>
          </div>

          {/* Section 7: Limitation of Liability */}
          <div className="rounded-3xl border border-border/80 bg-surface/80 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 text-link mb-3">
              <Scale className="h-5 w-5" />
              <h2 className="font-display text-xl font-medium text-foreground">
                7. Limitation of Liability & Disclaimers
              </h2>
            </div>
            <div className="space-y-3 text-sm text-muted leading-relaxed">
              <p>
                This website and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied.
              </p>
              <p>
                To the fullest extent permissible by applicable law, SiddhyySpace and Siddhi Singh shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access to or inability to use this site.
              </p>
            </div>
          </div>

          {/* Section 8: Contact */}
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-surface to-primary/10 p-6 sm:p-8 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-display text-lg font-medium text-foreground">
                Questions or Feedback on these Terms?
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                Reach out anytime for questions regarding community guidelines or partnerships.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href="/privacy-policy"
                className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground shadow-sm hover:bg-surface transition-all"
              >
                Privacy Policy
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
