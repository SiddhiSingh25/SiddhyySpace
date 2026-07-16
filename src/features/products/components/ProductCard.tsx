import Link from "next/link";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";

type ProductCardProps = {
  product: {
    slug: string;
    name: string;
    brand: string | null;
    image: string | null;
    description: string | null;
    price: number | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/products/${product.slug}`} className="block no-underline">
        <div
          className="aspect-square bg-primary/40"
          style={
            product.image
              ? {
                  backgroundImage: `url(${product.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
        <div className="space-y-1.5 p-4">
          {product.brand ? (
            <p className="text-xs uppercase tracking-wide text-muted">
              {product.brand}
            </p>
          ) : null}
          <Heading as="h3" className="text-lg text-foreground">
            {product.name}
          </Heading>
          {product.description ? (
            <Text muted className="line-clamp-2 text-sm">
              {product.description}
            </Text>
          ) : null}
          {product.price != null ? (
            <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
