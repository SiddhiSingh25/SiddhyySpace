import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { TiptapRenderer } from "@/features/blog/components/TiptapRenderer";
import { BlogEngagement } from "@/features/blog/components/BlogEngagement";
import {
  getBlogBySlug,
  getRelatedBlogs,
} from "@/features/blog/services/blog.service";
import { siteConfig } from "@/config/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) return { title: "Blog not found" };
    return {
      title: blog.title,
      description: blog.excerpt ?? undefined,
      openGraph: {
        title: blog.title,
        description: blog.excerpt ?? undefined,
        images: blog.coverImage ? [blog.coverImage] : undefined,
        type: "article",
      },
    };
  } catch {
    return { title: "Blogs" };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  let blog: Awaited<ReturnType<typeof getBlogBySlug>> = null;
  try {
    blog = await getBlogBySlug(slug);
  } catch {
    blog = null;
  }

  if (!blog) notFound();

  const related = await getRelatedBlogs(blog.id, blog.categoryId).catch(
    () => [],
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.publishedAt?.toISOString(),
    dateModified: blog.updatedAt.toISOString(),
    author: { "@type": "Person", name: siteConfig.name },
  };

  return (
    <Section>
      <Container className="max-w-3xl">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {blog.category ? (
          <p className="text-sm uppercase tracking-wide text-muted">
            {blog.category.name}
          </p>
        ) : null}
        <Heading as="h1" className="mt-2 text-balance">
          {blog.title}
        </Heading>
        <Text muted className="mt-4">
          {blog.publishedAt ? format(blog.publishedAt, "MMMM d, yyyy") : ""} ·{" "}
          {blog.readingTime} min read
        </Text>
        {blog.coverImage ? (
          <div
            className="mt-8 aspect-[16/9] rounded-2xl bg-primary/40"
            style={{
              backgroundImage: `url(${blog.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : null}

        <div className="prose-blog mt-10">
          <TiptapRenderer content={blog.content} />
        </div>

        <BlogEngagement
          blogId={blog.id}
          likeCount={blog._count.likes}
          commentCount={blog._count.comments}
        />

        {related.length > 0 ? (
          <div className="mt-16">
            <Heading as="h2">Related articles</Heading>
            <div className="mt-6 grid gap-6">
              {related.map((item) => (
                <BlogCard key={item.id} blog={item} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
