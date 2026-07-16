import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  description?: string;
};

export function Input({
  className,
  label,
  error,
  description,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link",
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
