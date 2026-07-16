import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ProductCard } from "@/features/products/components/ProductCard";
import { getVisibleProducts } from "@/features/products/services/product.service";

export const metadata: Metadata = {
  title: "Products",
  description: "Thoughtful product recommendations.",
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await getVisibleProducts().catch(() => []);

  return (
    <Section>
      <Container>
        <Heading as="h1">Products</Heading>
        <Text muted className="mt-3 max-w-2xl">
          Tools and products recommended with honesty.
        </Text>
        {products.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="No products yet"
            description="Product recommendations will appear here soon."
          />
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
