"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";

type Tag = { id: string; name: string };

export default function NewBookPage() {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTags() {
      try {
        const { data } = await axios.get("/api/admin/tags");
        if (data?.data) setAvailableTags(data.data);
      } catch {
        // tags not ready yet
      }
    }
    void loadTags();
  }, []);

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/books", {
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

      toast({ tone: "success", title: "Book created successfully." });
      router.push(`/admin/books/${data.data.id}`);
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not create book." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminHeader
        title="Add new book"
        description="Share a book you love with your notes and affiliate link."
        backHref="/admin/books"
        backLabel="Back to books"
      />

      <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Title *"
            placeholder="e.g. Atomic Habits"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Author *"
            placeholder="e.g. James Clear"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Custom slug (optional)"
            placeholder="atomic-habits"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            description="Leave blank to automatically slugify from title"
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
            placeholder="https://..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <Input
            label="YouTube / Video Review URL (optional)"
            placeholder="https://www.youtube.com/watch?v=..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>

        <Input
          label="Affiliate / Buy URL"
          placeholder="https://amzn.to/..."
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          description="Direct purchase or affiliate link for readers"
        />

        <Textarea
          label="Book summary & takeaways"
          placeholder="Why do you recommend this book? What are the key lessons?"
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
            Create book
          </Button>
        </div>
      </form>
    </div>
  );
}
