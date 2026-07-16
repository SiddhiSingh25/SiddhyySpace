import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variants = {
  primary:
    "bg-primary text-foreground hover:brightness-95 shadow-soft no-underline",
  secondary: "bg-surface text-foreground hover:bg-primary/40 no-underline",
  outline:
    "bg-transparent text-foreground border border-border hover:bg-surface no-underline",
  ghost: "bg-transparent text-foreground hover:bg-surface no-underline",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-180",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
