import { cn } from "@/lib/utils";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
  className?: string;
};

const sizes = {
  h1: "font-display text-4xl leading-tight tracking-tight sm:text-5xl",
  h2: "font-display text-3xl leading-snug tracking-tight sm:text-4xl",
  h3: "font-display text-2xl leading-snug sm:text-3xl",
  h4: "font-display text-xl leading-snug sm:text-2xl",
};

export function Heading({ as = "h2", children, className }: HeadingProps) {
  const Tag = as;
  return <Tag className={cn(sizes[as], className)}>{children}</Tag>;
}
