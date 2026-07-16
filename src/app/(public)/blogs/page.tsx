import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { EmptyState } from "@/components/feedback/EmptyState";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { getPublishedBlogs } from "@/features/blog/services/blog.service";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Thoughtful essays and personal notes.",
};

export const revalidate = 60;

export default async function BlogsPage() {
  let blogs: Awaited<ReturnType<typeof getPublishedBlogs>> = [];
  try {
    blogs = await getPublishedBlogs();
  } catch {
    blogs = [];
  }

  return (
    <Section>
      <Container>
        <Heading as="h1">Blogs</Heading>
        <Text muted className="mt-3 max-w-2xl">
          Writing meant to be read slowly — ideas, lessons, and quiet observations.
        </Text>

        {blogs.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="Nothing published yet"
            description="Check back soon for the first article."
          />
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} featured={index === 0} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
