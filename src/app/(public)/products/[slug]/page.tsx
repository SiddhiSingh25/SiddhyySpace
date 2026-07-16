import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getProductBySlug } from "@/features/products/services/product.service";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  return (
    <Section>
      <Container className="grid gap-10 md:grid-cols-[320px_1fr]">
        <div
          className="aspect-square rounded-2xl bg-primary/40"
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
        <div>
          {product.brand ? (
            <p className="text-sm uppercase tracking-wide text-muted">
              {product.brand}
            </p>
          ) : null}
          <Heading as="h1" className="mt-1">
            {product.name}
          </Heading>
          {product.price != null ? (
            <p className="mt-3 text-lg font-medium">
              ${product.price.toFixed(2)}
            </p>
          ) : null}
          {product.description ? (
            <Text className="mt-6 whitespace-pre-wrap">
              {product.description}
            </Text>
          ) : null}
          {product.affiliate?.url ? (
            <ButtonLink
              href={product.affiliate.url}
              className="mt-8"
              target="_blank"
              rel="noopener noreferrer sponsored"
            >
              View product
            </ButtonLink>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
