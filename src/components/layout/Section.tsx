import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-8 sm:py-12 md:py-16 lg:py-20", className)}>
      {children}
    </section>
  );
}
