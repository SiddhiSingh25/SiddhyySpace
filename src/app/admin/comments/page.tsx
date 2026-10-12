"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  User,
  Search,
} from "lucide-react";

type CommentItem = {
  id: string;
  content: string;
  approved: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  blog: {
    id: string;
    title: string;
    slug: string;
  };
};

export default function AdminCommentsPage() {
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set("q", search.trim());
        if (filter !== "all") params.set("filter", filter);

        const { data } = await axios.get(
          `/api/admin/comments?${params.toString()}`,
        );
        if (!ignore && data.data) {
          setComments(data.data);
        }
      } catch {
        if (!ignore) toast({ tone: "error", title: "Could not load comments." });
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    void load();
    return () => {
      ignore = true;
    };
  }, [search, filter, toast]);

  async function toggleApproval(id: string, currentApproved: boolean) {
    setActionLoadingId(id);
    try {
      await axios.patch(`/api/admin/comments/${id}`, {
        approved: !currentApproved,
      });

      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved: !currentApproved } : c)),
      );

      toast({
        tone: "success",
        title: !currentApproved ? "Comment approved." : "Comment hidden.",
      });
    } catch {
      toast({ tone: "error", title: "Could not update approval status." });
    } finally {
      setActionLoadingId(null);
    }
  }

  async function deleteComment(id: string) {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setActionLoadingId(id);
    try {
      await axios.delete(`/api/admin/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast({ tone: "success", title: "Comment deleted." });
    } catch {
      toast({ tone: "error", title: "Could not delete comment." });
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Comments"
        description="Moderate reader comments, discussions, and replies on blog posts."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comment content, author, or blog…"
            className="h-11 w-full rounded-xl border border-border bg-white pl-10 pr-4 text-sm outline-none transition focus:border-link"
          />
        </div>

        <div className="flex rounded-xl border border-border bg-white p-1 text-xs">
          {(["all", "approved", "pending"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3.5 py-1.5 font-medium capitalize transition ${
                filter === tab
                  ? "bg-foreground text-white shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab === "pending" ? "Pending Moderation" : tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-muted">
          Loading comments…
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-muted" />
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            No comments found
          </h3>
          <p className="mt-1 text-xs text-muted">
            {search
              ? "Try adjusting your search criteria."
              : "Reader comments on your blog posts will appear here for review."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-border bg-white p-5 shadow-soft transition hover:border-link/30"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {comment.user.image ? (
                    <img
                      src={comment.user.image}
                      alt={comment.user.name ?? "User"}
                      className="h-10 w-10 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted border border-border">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {comment.user.name ?? "Anonymous"}
                      </span>
                      <span className="text-xs text-muted">
                        ({comment.user.email})
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      On article:{" "}
                      <Link
                        href={`/blogs/${comment.blog.slug}`}
                        target="_blank"
                        className="font-medium text-link hover:underline"
                      >
                        {comment.blog.title}
                      </Link>{" "}
                      • {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {comment.approved ? (
                    <Badge variant="success">Approved</Badge>
                  ) : (
                    <Badge variant="warning">Pending Moderation</Badge>
                  )}
                </div>
              </div>

              {/* Comment text */}
              <div className="mt-4 rounded-xl bg-surface/60 p-3.5 text-sm text-foreground/90 leading-relaxed border border-border/40">
                {comment.content}
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/50 pt-3">
                <Button
                  size="sm"
                  variant={comment.approved ? "outline" : "primary"}
                  onClick={() => toggleApproval(comment.id, comment.approved)}
                  loading={actionLoadingId === comment.id}
                >
                  {comment.approved ? (
                    <>
                      <XCircle className="h-4 w-4 mr-1 text-muted" />
                      Hide
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1 text-emerald-600" />
                      Approve
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-danger hover:bg-rose-50"
                  onClick={() => deleteComment(comment.id)}
                  loading={actionLoadingId === comment.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
