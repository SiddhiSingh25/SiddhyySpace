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

export default function NewPlaylistPage() {
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
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/playlists", {
        title,
        slug: slug || undefined,
        category: category || null,
        embedUrl,
        image: image || null,
        description: description || null,
        featured,
        visible,
      });

      toast({ tone: "success", title: "Playlist created successfully." });
      router.push(`/admin/playlists/${data.data.id}`);
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not create playlist." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminHeader
        title="Add new playlist"
        description="Embed a Spotify playlist, album, or track with custom artwork."
        backHref="/admin/playlists"
        backLabel="Back to playlists"
      />

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Playlist title *"
            placeholder="e.g. Late Night Coding Vibes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Category / Mood"
            placeholder="e.g. Ambient, Lo-Fi, Focus"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <Input
          label="Spotify Embed URL or Link *"
          placeholder="https://open.spotify.com/embed/playlist/... or https://open.spotify.com/playlist/..."
          value={embedUrl}
          onChange={(e) => setEmbedUrl(e.target.value)}
          description="You can paste the Spotify iframe URL or share link"
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Cover image URL (optional)"
            placeholder="https://..."
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Input
            label="Slug (optional)"
            placeholder="late-night-coding-vibes"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <Textarea
          label="Description / story"
          placeholder="What is the story behind this playlist? When do you listen to it?"
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
            Create playlist
          </Button>
        </div>
      </form>
    </div>
  );
}
