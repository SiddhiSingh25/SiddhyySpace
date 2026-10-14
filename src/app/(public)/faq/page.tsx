import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { FaqAccordion } from "@/features/faq/components/FaqAccordion";
import { getFaqJsonLd } from "@/features/faq/data/faqData";
import { siteConfig } from "@/config/site";
import { HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Find answers to frequently asked questions about SiddhyySpace, Siddhi Singh, beauty & lifestyle product recommendations, affiliate disclosures, and shopping guides.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: `Frequently Asked Questions · ${siteConfig.name}`,
    description:
      "Find answers to frequently asked questions about SiddhyySpace, Siddhi Singh, lifestyle essentials, product recommendations, and affiliate transparency.",
    url: `${siteConfig.url}/faq`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Frequently Asked Questions · ${siteConfig.name}`,
    description:
      "Find answers to frequently asked questions about SiddhyySpace, Siddhi Singh, lifestyle essentials, product recommendations, and affiliate transparency.",
  },
};

export default function FaqPage() {
  const jsonLd = getFaqJsonLd();

  return (
    <>
      {/* Schema.org FAQPage Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section className="py-12 sm:py-16 lg:py-20">
        <Container>
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur mb-5">
              <HelpCircle className="h-3.5 w-3.5 text-link" />
              <span>SiddhyySpace Knowledge Base</span>
            </div>

            <Heading as="h1" className="text-balance font-display text-4xl sm:text-5xl font-medium tracking-tight">
              Frequently Asked Questions
            </Heading>

            <Text muted className="mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about SiddhyySpace, how Siddhi Singh curates lifestyle recommendations, affiliate transparency, and how to get in touch.
            </Text>
          </div>

          {/* Interactive Accordion */}
          <FaqAccordion />
        </Container>
      </Section>
    </>
  );
}
