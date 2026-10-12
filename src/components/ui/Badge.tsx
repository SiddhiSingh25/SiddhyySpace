import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md";
};

const variants = {
  default: "bg-surface text-foreground border border-border",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-rose-50 text-rose-700 border border-rose-200",
  info: "bg-primary/50 text-foreground border border-link/20",
  outline: "bg-transparent text-muted border border-border",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs font-medium",
  md: "px-2.5 py-1 text-xs font-semibold",
};

export function Badge({
  className,
  variant = "default",
  size = "sm",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
