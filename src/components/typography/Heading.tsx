import { cn } from "@/lib/utils";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4";
  children: React.ReactNode;
  className?: string;
};

const sizes = {
  h1: "font-display text-2xl leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl",
  h2: "font-display text-xl leading-snug tracking-tight sm:text-3xl md:text-4xl",
  h3: "font-display text-lg leading-snug sm:text-2xl md:text-3xl",
  h4: "font-display text-base leading-snug sm:text-xl md:text-2xl",
};

export function Heading({ as = "h2", children, className }: HeadingProps) {
  const Tag = as;
  return <Tag className={cn(sizes[as], className)}>{children}</Tag>;
}
