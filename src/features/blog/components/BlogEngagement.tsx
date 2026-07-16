"use client";

import { useSession, signIn } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import axios from "axios";

type Props = {
  blogId: string;
  likeCount: number;
  commentCount: number;
};

type CommentItem = {
  id: string;
  content: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
  replies?: CommentItem[];
};

export function BlogEngagement({ blogId, likeCount, commentCount }: Props) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

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
      await axios.post(`/api/likes`, { blogId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-engagement", blogId] });
    },
    onError: () => toast({ tone: "error", title: "Could not update like." }),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/saved`, { blogId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-engagement", blogId] });
      toast({ tone: "success", title: "Saved for later." });
    },
    onError: () => toast({ tone: "error", title: "Could not save article." }),
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/comments`, { blogId, content });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["blog-comments", blogId] });
      toast({ tone: "success", title: "Comment posted." });
    },
    onError: () => toast({ tone: "error", title: "Could not post comment." }),
  });

  const requireAuth = (action: () => void) => {
    if (!session?.user) {
      void signIn("google");
      return;
    }
    action();
  };

  const likes = statusQuery.data?.likes ?? likeCount;

  return (
    <div className="mt-12 space-y-8 border-t border-border pt-8">
      <div className="flex flex-wrap gap-3">
        <Button
          variant={statusQuery.data?.liked ? "primary" : "outline"}
          onClick={() => requireAuth(() => likeMutation.mutate())}
          loading={likeMutation.isPending}
        >
          Like · {likes}
        </Button>
        <Button
          variant={statusQuery.data?.saved ? "primary" : "outline"}
          onClick={() => requireAuth(() => saveMutation.mutate())}
          loading={saveMutation.isPending}
        >
          {statusQuery.data?.saved ? "Saved" : "Save"}
        </Button>
      </div>

      <div>
        <h3 className="font-display text-2xl">
          Comments · {commentsQuery.data?.length ?? commentCount}
        </h3>
        <div className="mt-4 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="Share a thoughtful note…"
            className="w-full rounded-xl border border-border bg-white p-3 text-sm outline-none focus:border-link"
          />
          <Button
            onClick={() =>
              requireAuth(() => {
                if (!content.trim()) return;
                commentMutation.mutate();
              })
            }
            loading={commentMutation.isPending}
          >
            Post comment
          </Button>
        </div>

        <ul className="mt-6 space-y-4">
          {(commentsQuery.data ?? []).map((comment) => (
            <li
              key={comment.id}
              className="rounded-xl border border-border bg-surface/40 p-4"
            >
              <p className="text-sm font-medium">
                {comment.user.name ?? "Reader"}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{comment.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
