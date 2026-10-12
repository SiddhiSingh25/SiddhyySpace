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

type Tag = { id: string; name: string };

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [rating, setRating] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [visible, setVisible] = useState(true);

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookRes, tagsRes] = await Promise.all([
          axios.get(`/api/admin/books/${id}`),
          axios.get("/api/admin/tags").catch(() => ({ data: { data: [] } })),
        ]);

        const book = bookRes.data.data;
        setTitle(book.title);
        setAuthor(book.author);
        setSlug(book.slug);
        setSummary(book.summary ?? "");
        setCoverImage(book.coverImage ?? "");
        setVideoUrl(book.videoUrl ?? "");
        setRating(book.rating !== null ? String(book.rating) : "");
        setAffiliateUrl(book.affiliate?.url ?? "");
        setFeatured(book.featured);
        setVisible(book.visible);
        if (book.tags) {
          setSelectedTagIds(book.tags.map((t: { tagId: string }) => t.tagId));
        }

        if (tagsRes.data?.data) {
          setAvailableTags(tagsRes.data.data);
        }
      } catch {
        toast({ tone: "error", title: "Could not load book details." });
      } finally {
        setReady(true);
      }
    }
    void loadData();
  }, [id, toast]);

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((item) => item !== tagId) : [...prev, tagId],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/admin/books/${id}`, {
        title,
        author,
        slug: slug || undefined,
        summary: summary || null,
        coverImage: coverImage || null,
        videoUrl: videoUrl || null,
        rating: rating ? parseFloat(rating) : null,
        affiliateUrl: affiliateUrl || null,
        featured,
        visible,
        tagIds: selectedTagIds,
      });

      toast({ tone: "success", title: "Book updated successfully." });
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not update book." });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/books/${id}`);
      toast({ tone: "success", title: "Book deleted." });
      router.push("/admin/books");
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not delete book." });
      setDeleting(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading book details…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminHeader
        title="Edit book"
        description={`Update metadata and links for "${title}".`}
        backHref="/admin/books"
        backLabel="Back to books"
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

      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Author *"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Input
            label="Rating (0.0 - 5.0)"
            placeholder="4.8"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Cover image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <Input
            label="YouTube / Video Review URL (optional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <Input
          label="Affiliate / Buy URL"
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          description="Direct purchase or affiliate link for readers"
        />

        <Textarea
          label="Book summary & takeaways"
          rows={5}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        {availableTags.length > 0 ? (
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition ${
                      isSelected
                        ? "bg-foreground text-white border-foreground"
                        : "bg-surface text-foreground border-border hover:bg-surface/80"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <Toggle
            label="Visible on website"
            description="Show this book on the public books showcase"
            checked={visible}
            onChange={setVisible}
          />
          <Toggle
            label="Featured book"
            description="Highlight this book on the homepage or top of list"
            checked={featured}
            onChange={setFeatured}
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/books")}
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
