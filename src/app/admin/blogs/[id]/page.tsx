"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [content, setContent] = useState<object>(emptyDoc);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await axios.get(`/api/admin/blogs/${id}`);
      const blog = data.data;
      setTitle(blog.title);
      setExcerpt(blog.excerpt ?? "");
      setCoverImage(blog.coverImage ?? "");
      setStatus(blog.status);
      setContent(blog.content ?? emptyDoc);
      setReady(true);
    }
    void load();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/admin/blogs/${id}`, {
        title,
        excerpt,
        coverImage: coverImage || null,
        status,
        content,
      });
      toast({ tone: "success", title: "Blog updated." });
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not update blog." });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!window.confirm("Soft-delete this blog?")) return;
    await axios.delete(`/api/admin/blogs/${id}`);
    toast({ tone: "success", title: "Blog deleted." });
    router.push("/admin/blogs");
    router.refresh();
  }

  if (!ready) {
    return <p className="text-muted">Loading editor…</p>;
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Heading as="h1">Edit blog</Heading>
        <Button type="button" variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
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
        <BlogEditor key={id} value={content} onChange={setContent} />
      </div>
      <Button type="submit" loading={loading}>
        Save changes
      </Button>
    </form>
  );
}
