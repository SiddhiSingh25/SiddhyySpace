import type { Metadata } from "next";
import { format } from "date-fns";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { EmptyState } from "@/components/feedback/EmptyState";
import { getVisibleCelebrations } from "@/features/celebration/services/celebration.service";

export const metadata: Metadata = {
  title: "Celebrations",
  description: "Milestones from the journey.",
};

export const revalidate = 60;

export default async function CelebrationsPage() {
  const celebrations = await getVisibleCelebrations().catch(() => []);

  return (
    <Section>
      <Container>
        <Heading as="h1">Celebrations</Heading>
        <Text muted className="mt-3 max-w-2xl">
          A quiet timeline of progress.
        </Text>
        {celebrations.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="No celebrations yet"
            description="Milestones will show up here as the journey grows."
          />
        ) : (
          <ol className="mt-10 space-y-8 border-l border-border pl-6">
            {celebrations.map((item) => (
              <li key={item.id} className="relative">
                <span className="absolute -left-[1.91rem] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                <p className="text-xs uppercase tracking-wide text-muted">
                  {format(item.date, "MMMM d, yyyy")}
                </p>
                <Heading as="h2" className="mt-1 text-2xl">
                  {item.title}
                </Heading>
                {item.description ? (
                  <Text muted className="mt-2">
                    {item.description}
                  </Text>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </Container>
    </Section>
  );
}
