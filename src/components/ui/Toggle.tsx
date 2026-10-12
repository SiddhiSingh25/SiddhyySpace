import { cn } from "@/lib/utils";

type ToggleProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
};

export function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  id,
}: ToggleProps) {
  const toggleId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-white p-4">
      <div className="space-y-0.5">
        <label
          htmlFor={toggleId}
          className="text-sm font-medium text-foreground cursor-pointer select-none"
        >
          {label}
        </label>
        {description ? (
          <p className="text-xs text-muted">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        id={toggleId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-link disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-link" : "bg-border",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
