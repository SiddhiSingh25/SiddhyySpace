import { format } from "date-fns";
import Link from "next/link";
import { Heading } from "@/components/typography/Heading";
import { Text } from "@/components/typography/Text";
import { cn } from "@/lib/utils";
import { isVideoUrl, isDirectVideoUrl } from "@/utils/media";
import { Film } from "lucide-react";

type BlogCardProps = {
  blog: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    readingTime: number;
    publishedAt: Date | null;
    category?: { name: string; slug: string } | null;
  };
  featured?: boolean;
  className?: string;
};

export function BlogCard({ blog, featured, className }: BlogCardProps) {
  const isVideo = isVideoUrl(blog.coverImage);
  const isDirect = isDirectVideoUrl(blog.coverImage);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-soft",
        featured && "md:col-span-2",
        className,
      )}
    >
      <Link href={`/blogs/${blog.slug}`} className="block no-underline">
        <div
          className={cn(
            "bg-primary/50 relative overflow-hidden",
            featured ? "aspect-[21/9]" : "aspect-[16/10]",
          )}
          style={
            blog.coverImage && !isVideo
              ? {
                  backgroundImage: `url(${blog.coverImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {blog.coverImage && isVideo ? (
            isDirect ? (
              <video
                src={blog.coverImage}
                muted
                loop
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-white">
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                  <Film className="h-4 w-4" />
                  <span>Video Story</span>
                </div>
              </div>
            )
          ) : null}
        </div>
        <div className="space-y-2 p-5">
          {blog.category ? (
            <p className="text-xs uppercase tracking-wide text-muted">
              {blog.category.name}
            </p>
          ) : null}
          <Heading as="h3" className="text-foreground group-hover:text-link">
            {blog.title}
          </Heading>
          {blog.excerpt ? (
            <Text muted className="line-clamp-2">
              {blog.excerpt}
            </Text>
          ) : null}
          <p className="text-xs text-muted">
            {blog.publishedAt
              ? format(blog.publishedAt, "MMM d, yyyy")
              : "Draft"}{" "}
            · {blog.readingTime} min read
          </p>
        </div>
      </Link>
    </article>
  );
}
