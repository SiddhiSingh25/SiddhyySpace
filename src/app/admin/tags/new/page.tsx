"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";

export default function NewTagPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/tags", {
        name,
        slug: slug || undefined,
      });

      toast({ tone: "success", title: "Tag created successfully." });
      router.push(`/admin/tags/${data.data.id}`);
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not create tag." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <AdminHeader
        title="Add new tag"
        description="Create a tag identifier for articles and book notes."
        backHref="/admin/tags"
        backLabel="Back to tags"
      />

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
      >
        <Input
          label="Tag name *"
          placeholder="e.g. Design, Systems, Habits"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Slug (optional)"
          placeholder="e.g. design"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          description="Identifier without spaces. Auto-generated if left blank."
        />

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/tags")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create tag
          </Button>
        </div>
      </form>
    </div>
  );
}
