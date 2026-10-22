import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Heading } from "@/components/typography/Heading";
import { BlogCard } from "@/features/blog/components/BlogCard";
import { TiptapRenderer } from "@/features/blog/components/TiptapRenderer";
import { BlogEngagement } from "@/features/blog/components/BlogEngagement";
import { ReadingProgressBar } from "@/features/blog/components/ReadingProgressBar";
import {
  getBlogBySlug,
  getRelatedBlogs,
} from "@/features/blog/services/blog.service";
import { isVideoUrl, isDirectVideoUrl, toVideoEmbedUrl } from "@/utils/media";
import { siteConfig } from "@/config/site";
import avatarImg from "@/assets/profile/profile.png";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await getBlogBySlug(slug);
    if (!blog) return { title: "Blog not found" };
    return {
      title: `${blog.title} · ${siteConfig.name}`,
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
    <Section className="py-4 sm:py-6 lg:py-8">
      <ReadingProgressBar />
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Back Link & Category */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted no-underline transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to all stories</span>
          </Link>

          {blog.category ? (
            <span className="inline-flex items-center rounded-full bg-primary/40 px-3 py-0.5 text-xs font-semibold tracking-wide uppercase text-link border border-primary/60">
              {blog.category.name}
            </span>
          ) : null}
        </div>

        {/* Article Title */}
        <Heading
          as="h1"
          className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.18]"
        >
          {blog.title}
        </Heading>

        {/* Excerpt */}
        {blog.excerpt ? (
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted">
            {blog.excerpt}
          </p>
        ) : null}

        {/* Author Byline & Metadata */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border/70 py-3.5">
          <div className="flex items-center gap-3">
            <Image
              src={avatarImg}
              alt={siteConfig.name}
              width={38}
              height={38}
              className="h-9 w-9 rounded-full border border-border object-cover"
            />
            <div className="text-xs sm:text-sm">
              <span className="font-medium text-foreground">{siteConfig.name}</span>
              <div className="flex items-center gap-2 text-muted">
                <span>
                  {blog.publishedAt
                    ? format(blog.publishedAt, "MMMM d, yyyy")
                    : "Draft"}
                </span>
                <span>·</span>
                <span>{blog.readingTime} min read</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {blog.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-muted border border-border/60"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover Media */}
        {blog.coverImage ? (
          <div className="mt-8 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/70 bg-surface/40 shadow-soft">
            {isVideoUrl(blog.coverImage) ? (
              <div className="aspect-[16/9] overflow-hidden bg-black">
                {isDirectVideoUrl(blog.coverImage) ? (
                  <video
                    controls
                    playsInline
                    autoPlay
                    muted
                    loop
                    src={blog.coverImage}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <iframe
                    src={toVideoEmbedUrl(blog.coverImage)}
                    className="h-full w-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                )}
              </div>
            ) : (
              <div className="aspect-[16/9] sm:aspect-[21/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-[1.01]"
                />
              </div>
            )}
          </div>
        ) : null}

        {/* Article Reading Body (Exact same width as Cover Media) */}
        <div className="mt-10 w-full">
          <TiptapRenderer content={blog.content} />
        </div>

        {/* Clean, Simple, Aesthetic Engagement & Comments (Exact same width as Cover Media) */}
        <div className="w-full">
          <BlogEngagement
            blogId={blog.id}
            blogTitle={blog.title}
            blogSlug={blog.slug}
            likeCount={blog._count.likes}
            commentCount={blog._count.comments}
            authorName={siteConfig.name}
          />
        </div>

        {/* Related Articles */}
        {related.length > 0 ? (
          <div className="mt-20 border-t border-border/70 pt-12">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  <Sparkles className="h-3.5 w-3.5 text-link" />
                  Keep Reading
                </span>
                <Heading as="h2" className="mt-1">
                  Related stories
                </Heading>
              </div>
              <Link
                href="/blogs"
                className="text-sm font-medium text-link hover:text-link-hover no-underline"
              >
                View all blogs &rarr;
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
