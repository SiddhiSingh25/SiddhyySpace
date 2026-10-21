"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CoverMediaUpload } from "@/features/admin/components/CoverMediaUpload";
import { BlogEditor } from "@/features/admin/components/BlogEditor";
import { useToast } from "@/providers/ToastProvider";

export default function NewBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [content, setContent] = useState<unknown>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/blogs", {
        title,
        excerpt,
        coverImage: coverImage || null,
        status,
        content,
      });
      toast({ tone: "success", title: "Blog created." });
      router.push(`/admin/blogs/${data.data.id}`);
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not create blog." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-6">
      <AdminHeader
        title="New blog"
        description="Write and publish a new article, story, or guide."
        backHref="/admin/blogs"
        backLabel="Back to blogs"
      />

      <Input
        label="Title"
        placeholder="Enter blog title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Excerpt"
        placeholder="Short description or summary of the blog post…"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />

      <CoverMediaUpload
        label="Cover Media (Image or Video)"
        description="Choose a cover photo or video (MP4, YouTube, Vimeo) to showcase at the top of your blog."
        value={coverImage}
        onChange={setCoverImage}
        folder="siddhyy-blogs"
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
          className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm"
        >
          <option value="DRAFT">Draft (only visible to admin)</option>
          <option value="PUBLISHED">Published (visible to readers)</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Article Content</label>
        <BlogEditor value={content} onChange={setContent} />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create blog
        </Button>
      </div>
    </form>
  );
}
