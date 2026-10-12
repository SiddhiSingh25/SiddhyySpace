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

export default function EditPlaylistPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [visible, setVisible] = useState(true);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await axios.get(`/api/admin/playlists/${id}`);
        const pl = data.data;
        setTitle(pl.title);
        setSlug(pl.slug);
        setCategory(pl.category ?? "");
        setEmbedUrl(pl.embedUrl);
        setImage(pl.image ?? "");
        setDescription(pl.description ?? "");
        setFeatured(pl.featured);
        setVisible(pl.visible);
      } catch {
        toast({ tone: "error", title: "Could not load playlist." });
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
      await axios.put(`/api/admin/playlists/${id}`, {
        title,
        slug: slug || undefined,
        category: category || null,
        embedUrl,
        image: image || null,
        description: description || null,
        featured,
        visible,
      });

      toast({ tone: "success", title: "Playlist updated successfully." });
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not update playlist." });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!window.confirm("Are you sure you want to delete this playlist?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/playlists/${id}`);
      toast({ tone: "success", title: "Playlist deleted." });
      router.push("/admin/playlists");
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not delete playlist." });
      setDeleting(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading playlist…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminHeader
        title="Edit playlist"
        description={`Update embeds and details for "${title}".`}
        backHref="/admin/playlists"
        backLabel="Back to playlists"
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Playlist title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Category / Mood"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <Input
          label="Spotify Embed URL or Link *"
          value={embedUrl}
          onChange={(e) => setEmbedUrl(e.target.value)}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Cover image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <Textarea
          label="Description / story"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <Toggle
            label="Visible on website"
            description="Display this playlist in the public showcase"
            checked={visible}
            onChange={setVisible}
          />
          <Toggle
            label="Featured playlist"
            description="Feature this playlist on the homepage player"
            checked={featured}
            onChange={setFeatured}
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/playlists")}
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
