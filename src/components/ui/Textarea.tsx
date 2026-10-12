import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  description?: string;
};

export function Textarea({
  className,
  label,
  error,
  description,
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={textareaId} className="block text-sm font-medium">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        rows={rows}
        className={cn(
          "w-full rounded-xl border border-border bg-white p-3 text-sm outline-none transition focus:border-link",
          error && "border-danger",
          className,
        )}
        {...props}
      />
      {description && !error ? (
        <p className="text-xs text-muted">{description}</p>
      ) : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
