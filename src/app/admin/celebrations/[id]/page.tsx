"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Trash2 } from "lucide-react";

export default function EditCelebrationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [order, setOrder] = useState("0");
  const [visible, setVisible] = useState(true);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await axios.get(`/api/admin/celebrations/${id}`);
        const cel = data.data;
        setTitle(cel.title);
        setDescription(cel.description ?? "");
        setImage(cel.image ?? "");
        setDate(new Date(cel.date).toISOString().slice(0, 10));
        setOrder(String(cel.order ?? 0));
        setVisible(cel.visible);
      } catch {
        toast({ tone: "error", title: "Could not load celebration." });
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
      await axios.put(`/api/admin/celebrations/${id}`, {
        title,
        description: description || null,
        image: image || null,
        date: new Date(date).toISOString(),
        order: parseInt(order, 10) || 0,
        visible,
      });

      toast({ tone: "success", title: "Celebration updated successfully." });
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not update celebration." });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!window.confirm("Are you sure you want to delete this celebration?"))
      return;
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/celebrations/${id}`);
      toast({ tone: "success", title: "Celebration deleted." });
      router.push("/admin/celebrations");
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not delete celebration." });
      setDeleting(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading celebration…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminHeader
        title="Edit celebration"
        description={`Update celebration details for "${title}".`}
        backHref="/admin/celebrations"
        backLabel="Back to celebrations"
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
          label="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Display order"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            description="Lower numbers display first"
          />
        </div>

        <Input
          label="Celebration photo / banner URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Textarea
          label="Milestone story / message"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="pt-2">
          <Toggle
            label="Visible on website"
            description="Display this celebration on the celebrations wall"
            checked={visible}
            onChange={setVisible}
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/celebrations")}
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
