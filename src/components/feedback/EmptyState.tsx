import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-10",
        className,
      )}
    >
      <h3 className="font-display text-xl">{title}</h3>
      {description ? <p className="max-w-md text-muted">{description}</p> : null}
      {action}
    </div>
  );
}
