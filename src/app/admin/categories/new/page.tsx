"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";

export default function NewCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/categories", {
        name,
        slug: slug || undefined,
        description: description || null,
      });

      toast({ tone: "success", title: "Category created successfully." });
      router.push(`/admin/categories/${data.data.id}`);
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not create category." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <AdminHeader
        title="Add new category"
        description="Create a category to group blogs and thoughts."
        backHref="/admin/categories"
        backLabel="Back to categories"
      />

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
      >
        <Input
          label="Category name *"
          placeholder="e.g. Technology, Philosophy, Books"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Slug (optional)"
          placeholder="e.g. technology"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          description="Unique URL identifier. Auto-generated if left blank."
        />

        <Textarea
          label="Description (optional)"
          placeholder="What kind of writings live inside this category?"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/categories")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create category
          </Button>
        </div>
      </form>
    </div>
  );
}
