import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

export default function AdminPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <Heading as="h1">{title}</Heading>
      <Text muted className="mt-2 max-w-2xl">
        {description}
      </Text>
      <div className="mt-8 rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted">
        Management UI for this section is wired in the admin nav and ready for
        the next CRUD pass. Blog management is fully available now.
      </div>
    </div>
  );
}
