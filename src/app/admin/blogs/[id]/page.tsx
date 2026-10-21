"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CoverMediaUpload } from "@/features/admin/components/CoverMediaUpload";
import { BlogEditor } from "@/features/admin/components/BlogEditor";
import { useToast } from "@/providers/ToastProvider";
import { Trash2 } from "lucide-react";

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [content, setContent] = useState<unknown>("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await axios.get(`/api/admin/blogs/${id}`);
        const blog = data.data;
        setTitle(blog.title);
        setExcerpt(blog.excerpt ?? "");
        setCoverImage(blog.coverImage ?? "");
        setStatus(blog.status);
        setContent(blog.content ?? "");
        setReady(true);
      } catch {
        toast({ tone: "error", title: "Could not load blog details." });
      }
    }
    void load();
  }, [id, toast]);

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
    try {
      await axios.delete(`/api/admin/blogs/${id}`);
      toast({ tone: "success", title: "Blog deleted." });
      router.push("/admin/blogs");
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not delete blog." });
    }
  }

  if (!ready) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-muted">
        Loading editor…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-6">
      <AdminHeader
        title="Edit blog"
        description="Update article contents, media, settings, or delete this post."
        backHref="/admin/blogs"
        backLabel="Back to blogs"
      >
        <Button type="button" variant="danger" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AdminHeader>

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
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Article Content</label>
        <BlogEditor key={id} value={content} onChange={setContent} />
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
          Save changes
        </Button>
      </div>
    </form>
  );
}
