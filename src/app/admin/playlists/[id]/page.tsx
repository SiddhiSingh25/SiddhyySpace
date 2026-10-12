"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/features/admin/components/ImageUpload";
import { useToast } from "@/providers/ToastProvider";
import { formatSpotifyEmbedUrl } from "@/features/spotify/utils";
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
      const formattedEmbedUrl = formatSpotifyEmbedUrl(embedUrl);
      await axios.put(`/api/admin/playlists/${id}`, {
        title,
        slug: slug || undefined,
        category: category || null,
        embedUrl: formattedEmbedUrl,
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
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          description="URL identifier for this playlist"
        />

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
