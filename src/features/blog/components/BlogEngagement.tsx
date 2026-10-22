"use client";

import { useSession, signIn } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Bookmark,
  MessageSquare,
  Share2,
  Send,
  CornerDownRight,
  Check,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";
import axios from "axios";
import avatarImg from "@/assets/profile/profile.png";

type Props = {
  blogId: string;
  likeCount: number;
  commentCount: number;
  blogTitle?: string;
  blogSlug?: string;
  authorName?: string;
};

type CommentUser = {
  name: string | null;
  image: string | null;
};

type ReplyItem = {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  user: CommentUser;
};

type CommentItem = {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  user: CommentUser;
  replies?: ReplyItem[];
};

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Recently";
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Recently";
  }
}

function getInitials(name?: string | null): string {
  if (!name) return "R";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

function UserAvatar({
  src,
  name,
  size = "md",
}: {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md";
}) {
  const [imageError, setImageError] = useState(false);
  const sizeClass = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name ?? "User"}
        onError={() => setImageError(true)}
        referrerPolicy="no-referrer"
        className={cn(
          "rounded-full object-cover border border-border/70 shrink-0",
          sizeClass
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary/70 via-indigo-100 to-sky-100 text-link font-semibold flex items-center justify-center shrink-0 border border-primary/40",
        sizeClass
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export function BlogEngagement({
  blogId,
  likeCount,
  commentCount,
  authorName = "Siddhi Singh",
}: Props) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(false);

  // Minimal scroll listener for floating dock
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowFloatingBar(true);
      } else {
        setShowFloatingBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const statusQuery = useQuery({
    queryKey: ["blog-engagement", blogId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/blogs/${blogId}/engagement`);
      return data.data as {
        liked: boolean;
        saved: boolean;
        likes: number;
      };
    },
  });

  const commentsQuery = useQuery({
    queryKey: ["blog-comments", blogId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/comments?blogId=${blogId}`);
      return data.data as CommentItem[];
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/api/likes`, { blogId });
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["blog-engagement", blogId] });
      if (res?.data?.liked) {
        toast({ tone: "success", title: "Liked story" });
      }
    },
    onError: () => {
      toast({ tone: "error", title: "Could not update like." });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`/api/saved`, { blogId });
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["blog-engagement", blogId] });
      if (res?.data?.saved) {
        toast({
          tone: "success",
          title: "Saved for later",
        });
      } else {
        toast({
          tone: "info",
          title: "Removed from saved",
        });
      }
    },
    onError: () => {
      toast({ tone: "error", title: "Could not update saved articles." });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/comments`, { blogId, content: content.trim() });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
      toast({
        tone: "success",
        title: "Comment published",
      });
    },
    onError: () => {
      toast({ tone: "error", title: "Could not post comment." });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async ({
      parentId,
      text,
    }: {
      parentId: string;
      text: string;
    }) => {
      await axios.post(`/api/comments`, {
        blogId,
        content: text.trim(),
        parentId,
      });
    },
    onSuccess: () => {
      setReplyingToId(null);
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
      toast({ tone: "success", title: "Reply posted" });
    },
    onError: () => {
      toast({ tone: "error", title: "Could not post reply." });
    },
  });

  const requireAuth = (action: () => void) => {
    if (!session?.user) {
      void signIn("google");
      return;
    }
    action();
  };

  const isLiked = statusQuery.data?.liked ?? false;
  const isSaved = statusQuery.data?.saved ?? false;
  const likes = statusQuery.data?.likes ?? likeCount;
  const totalComments =
    (commentsQuery.data?.reduce(
      (acc, c) => acc + 1 + (c.replies?.length ?? 0),
      0
    ) ?? commentCount);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          tone: "success",
          title: "Link copied to clipboard",
        });
      }
    } catch {
      toast({ tone: "error", title: "Could not copy link." });
    }
  };

  const scrollToComments = () => {
    const el = document.getElementById("comments");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* FLOATING ACTION DOCK (Minimal, unobtrusive, clean) */}
      <AnimatePresence>
        {showFloatingBar && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 inset-x-0 mx-auto z-40 w-fit px-2"
          >
            <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-md">
              <button
                type="button"
                onClick={() => requireAuth(() => likeMutation.mutate())}
                aria-label={isLiked ? "Unlike story" : "Like story"}
                className="group flex items-center gap-1.5 px-2 py-1 text-xs font-medium cursor-pointer"
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isLiked
                      ? "fill-rose-500 text-rose-500"
                      : "text-muted group-hover:text-rose-500"
                  )}
                />
                <span
                  className={cn(
                    isLiked
                      ? "text-rose-600 font-semibold"
                      : "text-muted group-hover:text-foreground"
                  )}
                >
                  {likes}
                </span>
              </button>

              <div className="h-3.5 w-px bg-border/70" />

              <button
                type="button"
                onClick={scrollToComments}
                aria-label="View comments"
                className="group flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted hover:text-foreground cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-muted group-hover:text-foreground" />
                <span>{totalComments}</span>
              </button>

              <div className="h-3.5 w-px bg-border/70" />

              <button
                type="button"
                onClick={() => requireAuth(() => saveMutation.mutate())}
                aria-label={isSaved ? "Saved" : "Save story"}
                className="p-1 text-muted hover:text-foreground cursor-pointer"
                title={isSaved ? "Saved" : "Save for later"}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isSaved
                      ? "fill-link text-link"
                      : "text-muted group-hover:text-link"
                  )}
                />
              </button>

              <div className="h-3.5 w-px bg-border/70" />

              <button
                type="button"
                onClick={handleShare}
                aria-label="Copy story link"
                className="p-1 text-muted hover:text-foreground cursor-pointer"
                title="Copy link"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Share2 className="h-4 w-4 text-muted hover:text-foreground" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELICATE AUTHOR SIGNATURE */}
      <div className="mt-12 flex items-center gap-3 pt-6 text-sm text-muted">
        <Image
          src={avatarImg}
          alt={authorName}
          width={36}
          height={36}
          className="h-9 w-9 rounded-full border border-border/70 object-cover shrink-0"
        />
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-muted">Written by</span>
          <span
            className="great-vibes-regular text-lg text-foreground font-normal"
            style={{ fontFamily: "'Great Vibes', cursive" }}
          >
            {authorName}
          </span>
        </div>
      </div>

      {/* CLEAN, SIMPLE, AESTHETIC ENGAGEMENT BAR (NOT BULKY) */}
      <div className="my-6 flex items-center justify-between border-y border-border/70 py-3">
        {/* Left: Like & Comment */}
        <div className="flex items-center gap-6">
          {/* Like / Heart */}
          <button
            type="button"
            onClick={() => requireAuth(() => likeMutation.mutate())}
            aria-label={isLiked ? "Unlike story" : "Like story"}
            className="group flex items-center gap-2 text-sm transition cursor-pointer select-none"
          >
            <motion.div whileTap={{ scale: 0.85 }}>
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isLiked
                    ? "fill-rose-500 text-rose-500"
                    : "text-muted group-hover:text-rose-500"
                )}
              />
            </motion.div>
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isLiked
                  ? "text-rose-600 font-semibold"
                  : "text-muted group-hover:text-foreground"
              )}
            >
              {likes}
            </span>
          </button>

          {/* Comment Count / Jump */}
          <button
            type="button"
            onClick={scrollToComments}
            aria-label="View comments"
            className="group flex items-center gap-2 text-sm text-muted hover:text-foreground transition cursor-pointer select-none"
          >
            <MessageSquare className="h-5 w-5 text-muted transition-colors duration-200 group-hover:text-foreground" />
            <span className="text-sm font-medium">{totalComments}</span>
          </button>
        </div>

        {/* Right: Save & Share */}
        <div className="flex items-center gap-4">
          {/* Save / Bookmark */}
          <button
            type="button"
            onClick={() => requireAuth(() => saveMutation.mutate())}
            aria-label={isSaved ? "Saved" : "Save story"}
            className="group p-1.5 text-muted hover:text-foreground transition cursor-pointer select-none"
            title={isSaved ? "Saved to your list" : "Save for later"}
          >
            <motion.div whileTap={{ scale: 0.85 }}>
              <Bookmark
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isSaved
                    ? "fill-link text-link"
                    : "text-muted group-hover:text-link"
                )}
              />
            </motion.div>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share article link"
            className="group p-1.5 text-muted hover:text-foreground transition cursor-pointer select-none"
            title="Copy link"
          >
            {copied ? (
              <Check className="h-5 w-5 text-emerald-600" />
            ) : (
              <Share2 className="h-5 w-5 text-muted transition-colors duration-200 group-hover:text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* SIMPLE, CLEAN DISCUSSION & COMMENTS SECTION */}
      <section id="comments" className="mt-8 scroll-mt-20 space-y-6">
        <div className="flex items-center justify-between pb-1">
          <h3 className="font-display text-xl text-foreground font-semibold">
            Comments ({totalComments})
          </h3>
        </div>

        {/* COMMENT COMPOSER */}
        {session?.user ? (
          <div className="rounded-xl border border-border/80 bg-white p-3.5 transition focus-within:border-link/70">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder="Write a thoughtful comment…"
              className="w-full resize-none border-0 bg-transparent p-1 text-sm text-foreground outline-none placeholder:text-muted/60"
            />
            <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-2 text-xs">
              <span className="text-muted">
                {session.user.name ? `Commenting as ${session.user.name}` : ""}
              </span>
              <div className="flex items-center gap-2">
                {content.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setContent("")}
                    className="px-2 py-1 text-xs text-muted hover:text-foreground cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (!content.trim()) return;
                    commentMutation.mutate();
                  }}
                  disabled={!content.trim() || commentMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-link px-3.5 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-link-hover disabled:opacity-40 cursor-pointer transition"
                >
                  <Send className="h-3 w-3" />
                  <span>{commentMutation.isPending ? "Posting…" : "Post"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-border/70 bg-surface/30 px-4 py-3 text-xs sm:text-sm">
            <span className="text-muted">
              Sign in with Google to join the conversation.
            </span>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="font-medium text-link hover:underline cursor-pointer"
            >
              Sign in &rarr;
            </button>
          </div>
        )}

        {/* COMMENTS LIST */}
        <div className="space-y-3">
          {commentsQuery.isLoading ? (
            <div className="py-4 text-xs text-muted">Loading comments…</div>
          ) : (commentsQuery.data ?? []).length === 0 ? (
            <p className="py-4 text-xs sm:text-sm text-muted">
              No comments yet. Be the first to share your perspective.
            </p>
          ) : (
            <div className="space-y-3">
              {(commentsQuery.data ?? []).map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl border border-border/60 bg-white p-3.5 sm:p-4 transition hover:border-border"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar
                        src={comment.user.image}
                        name={comment.user.name}
                        size="sm"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-foreground">
                          {comment.user.name ?? "Reader"}
                        </span>
                        {comment.user.name === authorName && (
                          <span className="rounded-full bg-primary/60 px-1.5 py-0.2 text-[9px] font-semibold text-link uppercase tracking-wider">
                            Author
                          </span>
                        )}
                        <span className="text-[11px] text-muted">·</span>
                        <span className="text-[11px] text-muted">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        requireAuth(() => {
                          if (replyingToId === comment.id) {
                            setReplyingToId(null);
                            setReplyContent("");
                          } else {
                            setReplyingToId(comment.id);
                            setReplyContent("");
                          }
                        });
                      }}
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground cursor-pointer"
                    >
                      <CornerDownRight className="h-3 w-3" />
                      <span>Reply</span>
                    </button>
                  </div>

                  {/* Body */}
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap pl-8">
                    {comment.content}
                  </p>

                  {/* Inline Reply Composer */}
                  {replyingToId === comment.id && (
                    <div className="mt-3 pl-8">
                      <div className="rounded-lg border border-border/80 bg-surface/30 p-2.5">
                        <div className="flex items-center justify-between text-xs text-muted mb-1.5">
                          <span>
                            Replying to {comment.user.name ?? "Reader"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="text-muted hover:text-foreground p-0.5 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={2}
                          maxLength={1000}
                          placeholder="Write a reply…"
                          className="w-full resize-none rounded-md border border-border/70 bg-white p-2 text-xs text-foreground outline-none focus:border-link"
                        />
                        <div className="mt-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="px-2 py-1 text-xs text-muted hover:text-foreground cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!replyContent.trim()) return;
                              replyMutation.mutate({
                                parentId: comment.id,
                                text: replyContent,
                              });
                            }}
                            disabled={
                              !replyContent.trim() || replyMutation.isPending
                            }
                            className="inline-flex items-center gap-1 rounded-md bg-link px-3 py-1 text-xs font-medium text-white shadow-xs hover:bg-link-hover disabled:opacity-40 cursor-pointer"
                          >
                            <Send className="h-2.5 w-2.5" />
                            <span>
                              {replyMutation.isPending ? "Sending…" : "Reply"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-3 space-y-2.5 border-l border-border/70 pl-3.5 ml-4 sm:ml-8">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="rounded-lg border border-border/50 bg-surface/20 p-2.5 space-y-1"
                        >
                          <div className="flex items-center gap-2">
                            <UserAvatar
                              src={reply.user.image}
                              name={reply.user.name}
                              size="sm"
                            />
                            <span className="text-xs font-semibold text-foreground">
                              {reply.user.name ?? "Reader"}
                            </span>
                            {reply.user.name === authorName && (
                              <span className="rounded-full bg-primary/60 px-1.5 py-0.2 text-[9px] font-semibold text-link uppercase tracking-wider">
                                Author
                              </span>
                            )}
                            <span className="text-[10px] text-muted">·</span>
                            <span className="text-[10px] text-muted">
                              {formatRelativeTime(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed text-foreground/90 pl-8">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
