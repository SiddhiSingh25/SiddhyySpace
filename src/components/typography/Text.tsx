import { cn } from "@/lib/utils";

type TextProps = {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
  as?: "p" | "span";
};

export function Text({
  children,
  className,
  muted = false,
  as: Tag = "p",
}: TextProps) {
  return (
    <Tag
      className={cn(
        "text-base leading-relaxed",
        muted && "text-muted",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
