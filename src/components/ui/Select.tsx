import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  description?: string;
  options?: { value: string; label: string }[];
};

export function Select({
  className,
  label,
  error,
  description,
  id,
  options,
  children,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="block text-sm font-medium">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          "h-11 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link",
          error && "border-danger",
          className,
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      {description && !error ? (
        <p className="text-xs text-muted">{description}</p>
      ) : null}
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
