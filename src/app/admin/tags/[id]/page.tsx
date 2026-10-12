"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Trash2 } from "lucide-react";

export default function EditTagPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [blogsCount, setBlogsCount] = useState(0);
  const [booksCount, setBooksCount] = useState(0);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await axios.get(`/api/admin/tags/${id}`);
        const tag = data.data;
        setName(tag.name);
        setSlug(tag.slug);
        setBlogsCount(tag._count?.blogs ?? 0);
        setBooksCount(tag._count?.books ?? 0);
      } catch {
        toast({ tone: "error", title: "Could not load tag." });
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
      await axios.put(`/api/admin/tags/${id}`, {
        name,
        slug: slug || undefined,
      });

      toast({ tone: "success", title: "Tag updated successfully." });
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not update tag." });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    const totalCount = blogsCount + booksCount;
    if (
      !window.confirm(
        totalCount > 0
          ? `This tag is attached to ${totalCount} item(s). Delete it?`
          : "Are you sure you want to delete this tag?",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await axios.delete(`/api/admin/tags/${id}`);
      toast({ tone: "success", title: "Tag deleted." });
      router.push("/admin/tags");
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not delete tag." });
      setDeleting(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading tag…</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <AdminHeader
        title="Edit tag"
        description={`Update settings for #${slug}.`}
        backHref="/admin/tags"
        backLabel="Back to tags"
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
          label="Tag name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />

        <div className="rounded-xl bg-surface p-4 text-xs text-muted border border-border">
          Tag is currently linked to <span className="font-semibold text-foreground">{blogsCount}</span> blogs and{" "}
          <span className="font-semibold text-foreground">{booksCount}</span> books.
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/tags")}
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
