"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Heading } from "@/components/typography/Heading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BlogEditor } from "@/features/admin/components/BlogEditor";
import { useToast } from "@/providers/ToastProvider";

const emptyDoc = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export default function NewBlogPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [content, setContent] = useState<object>(emptyDoc);
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
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <Heading as="h1">New blog</Heading>
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        label="Excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
      />
      <Input
        label="Cover image URL"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
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
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Content</p>
        <BlogEditor value={content} onChange={setContent} />
      </div>
      <Button type="submit" loading={loading}>
        Create blog
      </Button>
    </form>
  );
}
