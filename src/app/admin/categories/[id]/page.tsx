"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Trash2 } from "lucide-react";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [blogsCount, setBlogsCount] = useState(0);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await axios.get(`/api/admin/categories/${id}`);
        const cat = data.data;
        setName(cat.name);
        setSlug(cat.slug);
        setDescription(cat.description ?? "");
        setBlogsCount(cat._count?.blogs ?? 0);
      } catch {
        toast({ tone: "error", title: "Could not load category." });
      } finally {
        setReady(true);
      }
    }
    void loadData();
  }, [id, toast]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/admin/categories/${id}`, {
        name,
        slug: slug || undefined,
        description: description || null,
      });

      toast({ tone: "success", title: "Category updated successfully." });
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not update category." });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (
      !window.confirm(
        blogsCount > 0
          ? `This category is used by ${blogsCount} blog(s). Delete it?`
          : "Are you sure you want to delete this category?",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast({ tone: "success", title: "Category deleted." });
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not delete category." });
      setDeleting(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading category…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <AdminHeader
        title="Edit category"
        description={`Update settings for "${name}".`}
        backHref="/admin/categories"
        backLabel="Back to categories"
      >
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={onDelete}
          loading={deleting}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AdminHeader>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
      >
        <Input
          label="Category name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <Textarea
          label="Description (optional)"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="rounded-xl bg-surface p-4 text-xs text-muted border border-border">
          Currently attached to <span className="font-semibold text-foreground">{blogsCount}</span> published or draft blogs.
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/categories")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
