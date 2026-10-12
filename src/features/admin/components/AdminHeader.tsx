import Link from "next/link";
import { Heading } from "@/components/typography/Heading";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ArrowLeft, Plus } from "lucide-react";

type AdminHeaderProps = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actionHref?: string;
  actionLabel?: string;
  children?: React.ReactNode;
};

export function AdminHeader({
  title,
  description,
  backHref,
  backLabel = "Back",
  actionHref,
  actionLabel,
  children,
}: AdminHeaderProps) {
  return (
    <div className="space-y-2">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground no-underline transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {backLabel}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Heading as="h1">{title}</Heading>
          {description ? (
            <p className="mt-1 text-sm text-muted">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {actionHref && actionLabel ? (
            <ButtonLink href={actionHref} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              {actionLabel}
            </ButtonLink>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
