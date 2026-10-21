"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export function DeleteBlogButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await axios.delete(`/api/admin/blogs/${id}`);
      toast({ tone: "success", title: "Blog deleted." });
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not delete blog." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      title="Delete blog"
      className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span>{loading ? "Deleting…" : "Delete"}</span>
    </button>
  );
}
