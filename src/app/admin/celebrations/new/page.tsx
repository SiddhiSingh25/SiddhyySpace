"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";

export default function NewCelebrationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [order, setOrder] = useState("0");
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/celebrations", {
        title,
        description: description || null,
        image: image || null,
        date: new Date(date).toISOString(),
        order: parseInt(order, 10) || 0,
        visible,
      });

      toast({ tone: "success", title: "Celebration created successfully." });
      router.push(`/admin/celebrations/${data.data.id}`);
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not create celebration." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminHeader
        title="New celebration"
        description="Add a special occasion or memorable achievement."
        backHref="/admin/celebrations"
        backLabel="Back to celebrations"
      />

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
      >
        <Input
          label="Title *"
          placeholder="e.g. Launched Siddhyy Space! 🚀"
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
            placeholder="0"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            description="Lower numbers display first"
          />
        </div>

        <Input
          label="Celebration photo / banner URL (optional)"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Textarea
          label="Milestone story / message"
          placeholder="Write about the journey, how it felt, and who helped make it possible..."
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
            Create celebration
          </Button>
        </div>
      </form>
    </div>
  );
}
