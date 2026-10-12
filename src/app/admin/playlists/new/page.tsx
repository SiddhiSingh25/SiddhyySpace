"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/features/admin/components/ImageUpload";
import { useToast } from "@/providers/ToastProvider";
import { formatSpotifyEmbedUrl } from "@/features/spotify/utils";

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
      const formattedEmbedUrl = formatSpotifyEmbedUrl(embedUrl);
      const { data } = await axios.post("/api/admin/playlists", {
        title,
        slug: slug || undefined,
        category: category || null,
        embedUrl: formattedEmbedUrl,
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

        <div className="space-y-3">
          <Input
            label="Spotify Embed URL or Link *"
            placeholder="https://open.spotify.com/playlist/... or https://open.spotify.com/track/..."
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            onBlur={() => {
              if (embedUrl.trim()) {
                setEmbedUrl(formatSpotifyEmbedUrl(embedUrl));
              }
            }}
            description="Paste any Spotify share link, embed code, or track/playlist URL — it will convert automatically"
            required
          />
          {embedUrl.trim() && (
            <div className="rounded-xl border border-border bg-slate-50/60 p-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-medium text-muted">Spotify Player Preview</span>
                {formatSpotifyEmbedUrl(embedUrl).includes("open.spotify.com/embed/") ? (
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Ready to embed
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Will convert on save
                  </span>
                )}
              </div>
              <iframe
                src={formatSpotifyEmbedUrl(embedUrl)}
                className="h-36 w-full rounded-lg"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <ImageUpload
          label="Custom cover artwork (optional)"
          description="Upload custom artwork directly to Cloudinary or leave blank to use Spotify artwork."
          value={image}
          onChange={setImage}
          folder="siddhyy/playlists"
        />

        <Input
          label="Custom slug (optional)"
          placeholder="late-night-coding-vibes"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          description="Leave blank to generate automatically from playlist title"
        />

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
