"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Heart,
  Smile,
  Pencil,
  Star,
  Share2,
  Trash2,
  X,
  Loader2,
  Send,
  MessageCircle,
} from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";

export type WallNote = {
  id: string;
  content: string;
  userId: string;
  theme: string;
  icon: string;
  likesCount: number;
  approved: boolean;
  createdAt: string | Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

const INITIAL_DEMO_NOTES: WallNote[] = [
  {
    id: "demo-1",
    content: "perfect",
    userId: "demo-user-1",
    theme: "emerald",
    icon: "bolt",
    likesCount: 14,
    approved: true,
    createdAt: new Date("2026-10-09"),
    user: {
      id: "demo-user-1",
      name: "Shristi",
      image: null,
    },
  },
  {
    id: "demo-2",
    content: "Good work man",
    userId: "demo-user-2",
    theme: "purple",
    icon: "sparkles",
    likesCount: 28,
    approved: true,
    createdAt: new Date("2026-10-02"),
    user: {
      id: "demo-user-2",
      name: "Rohan",
      image: null,
    },
  },
  {
    id: "demo-3",
    content: "This cozy space feels like home. Keep creating magic ✨",
    userId: "demo-user-3",
    theme: "rose",
    icon: "heart",
    likesCount: 39,
    approved: true,
    createdAt: new Date("2026-09-28"),
    user: {
      id: "demo-user-3",
      name: "Aanya",
      image: null,
    },
  },
];

const CARD_THEMES: Record<
  string,
  {
    bg: string;
    border: string;
    accent: string;
    waveFill: string;
    glow: string;
    badgeBg: string;
    label: string;
  }
> = {
  purple: {
    bg: "bg-gradient-to-b from-[#2a134d] via-[#1c0c35] to-[#120724]",
    border: "border-purple-500/30 hover:border-purple-400/50",
    accent: "text-purple-300",
    waveFill: "#120724",
    glow: "shadow-[0_0_35px_rgba(168,85,247,0.15)]",
    badgeBg: "bg-purple-600",
    label: "Purple Dusk",
  },
  emerald: {
    bg: "bg-gradient-to-b from-[#0d3326] via-[#09241b] to-[#04120d]",
    border: "border-emerald-500/30 hover:border-emerald-400/50",
    accent: "text-emerald-400",
    waveFill: "#04120d",
    glow: "shadow-[0_0_35px_rgba(16,185,129,0.15)]",
    badgeBg: "bg-emerald-600",
    label: "Emerald Moss",
  },
  violet: {
    bg: "bg-gradient-to-b from-[#231745] via-[#180f33] to-[#0e081f]",
    border: "border-indigo-500/30 hover:border-indigo-400/50",
    accent: "text-indigo-300",
    waveFill: "#0e081f",
    glow: "shadow-[0_0_35px_rgba(99,102,241,0.15)]",
    badgeBg: "bg-indigo-600",
    label: "Deep Violet",
  },
  rose: {
    bg: "bg-gradient-to-b from-[#3b1227] via-[#290c1b] to-[#14050d]",
    border: "border-pink-500/30 hover:border-pink-400/50",
    accent: "text-pink-300",
    waveFill: "#14050d",
    glow: "shadow-[0_0_35px_rgba(236,72,153,0.15)]",
    badgeBg: "bg-pink-600",
    label: "Velvet Rose",
  },
  amber: {
    bg: "bg-gradient-to-b from-[#38200b] via-[#281607] to-[#140b03]",
    border: "border-amber-500/30 hover:border-amber-400/50",
    accent: "text-amber-400",
    waveFill: "#140b03",
    glow: "shadow-[0_0_35px_rgba(245,158,11,0.15)]",
    badgeBg: "bg-amber-600",
    label: "Warm Amber",
  },
  cyan: {
    bg: "bg-gradient-to-b from-[#0b2d38] via-[#071f26] to-[#030d12]",
    border: "border-cyan-500/30 hover:border-cyan-400/50",
    accent: "text-cyan-300",
    waveFill: "#030d12",
    glow: "shadow-[0_0_35px_rgba(6,182,212,0.15)]",
    badgeBg: "bg-cyan-600",
    label: "Midnight Cyan",
  },
};

const ICONS_MAP: Record<string, React.ReactNode> = {
  sparkles: <Sparkles className="w-5 h-5" />,
  bolt: <Zap className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  smile: <Smile className="w-5 h-5" />,
  pencil: <Pencil className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
};

export default function WallOfLoveSection() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<WallNote[]>(INITIAL_DEMO_NOTES);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formContent, setFormContent] = useState("");
  const [formTheme, setFormTheme] = useState("purple");
  const [formIcon, setFormIcon] = useState("sparkles");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/wall-of-love");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setNotes(json.data);
        } else {
          setNotes(INITIAL_DEMO_NOTES);
        }
      }
    } catch {
      // Keep demo notes if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) return;

    if (!session?.user) {
      showToast("Please sign in to post a message!");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/wall-of-love", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formContent,
          theme: formTheme,
          icon: formIcon,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setNotes((prev) => [json.data, ...prev]);
        setFormContent("");
        setIsModalOpen(false);
        showToast("Your mark has been left on the wall! ❤️");
      } else {
        showToast(json.error || "Failed to post note.");
      }
    } catch {
      showToast("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    // Optimistic update
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likesCount: n.likesCount + 1 } : n))
    );

    if (id.startsWith("demo-")) return;

    try {
      await fetch(`/api/wall-of-love/${id}/like`, { method: "POST" });
    } catch {
      // ignore silently for likes
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast("Note deleted.");

    if (id.startsWith("demo-")) return;

    try {
      await fetch(`/api/wall-of-love/${id}`, { method: "DELETE" });
    } catch {
      fetchNotes();
    }
  };

  const handleShare = (note: WallNote) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`"${note.content}" — ${note.user.name || "A friend"}`);
      showToast("Note text copied to clipboard! ✨");
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#0c0a12] text-white py-20 px-4 sm:px-6 lg:px-8">
      {/* Subtle crumpled paper texture & background glowing ambient radial light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(147,51,234,0.18),transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(16,185,129,0.08),transparent_50%)]"
      />
      
      {/* Fine texture noise lines overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header matching attached design */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-300/70">
            THE WALL REMEMBERS
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-white">
            Words That Echo{" "}
            <span className="great-vibes-regular text-4xl sm:text-6xl lg:text-7xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 ml-1">
              Always
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto pt-1 font-light">
            A cozy corner where kind words, notes, and quiet reflections are preserved forever.
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* CARD 1: JOIN THE WALL (Interactive Action Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col justify-between rounded-3xl border border-purple-500/30 bg-gradient-to-b from-[#2a134d] via-[#1c0c35] to-[#120724] p-7 shadow-[0_0_35px_rgba(168,85,247,0.15)] transition-all duration-300 hover:border-purple-400/50 hover:shadow-[0_0_45px_rgba(168,85,247,0.25)] min-h-[300px]"
          >
            {/* Decorative sparkles */}
            <div className="absolute top-6 right-6 text-purple-300/40 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute bottom-16 left-6 text-purple-300/20">
              <Pencil className="w-5 h-5 -rotate-12" />
            </div>

            {/* Card Main Body */}
            <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
              <h3 className="great-vibes-regular text-3xl sm:text-4xl text-purple-200">
                &ldquo;Join the wall...&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-purple-300/80 font-light">
                {session?.user ? (
                  <>Logged in as <span className="font-medium text-purple-200">{session.user.name || session.user.email}</span></>
                ) : (
                  "Sign in to leave your mark"
                )}
              </p>

              <button
                onClick={() => {
                  if (!session) {
                    signIn("google");
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-purple-400/40 bg-purple-950/60 px-6 py-3 text-sm font-medium text-purple-100 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 hover:bg-purple-800/60 hover:border-purple-300 active:scale-95"
              >
                <Pencil className="w-4 h-4 text-pink-300" />
                <span>Write a message...</span>
              </button>
            </div>

            {/* Bottom Wave Pattern SVG */}
            <div className="w-full overflow-hidden leading-none pt-4">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="relative block w-full h-5 text-[#120724]"
              >
                <path
                  d="M0,0 C150,90 350,-40 500,45 C650,130 900,-30 1200,30 L1200,120 L0,120 Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>

            {/* Card Footer: Login buttons indicator */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-purple-900/40 text-xs text-purple-300/60">
              {!session ? (
                <>
                  <button
                    onClick={() => signIn("github")}
                    title="Sign in with GitHub"
                    className="p-1.5 rounded-full hover:bg-purple-900/50 hover:text-white transition"
                  >
                    <FaGithub className="w-4 h-4" />
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => signIn("google")}
                    title="Sign in with Google"
                    className="p-1.5 rounded-full hover:bg-purple-900/50 hover:text-white transition"
                  >
                    <FaGoogle className="w-4 h-4 text-emerald-400" />
                  </button>
                </>
              ) : (
                <span className="text-xs text-purple-300/80 font-medium">✨ Ready to share your love</span>
              )}
            </div>
          </motion.div>

          {/* RENDERING TESTIMONIAL NOTE CARDS */}
          {notes.map((note, index) => {
            const themeConfig = CARD_THEMES[note.theme] || CARD_THEMES.purple;
            const iconElement = ICONS_MAP[note.icon] || <Sparkles className="w-5 h-5" />;
            const isOwnerOrAdmin =
              session?.user &&
              (session.user.id === note.userId || session.user.role === "ADMIN");

            const formattedDate =
              typeof note.createdAt === "string" || note.createdAt instanceof Date
                ? new Date(note.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "Recently";

            const userInitial = note.user?.name ? note.user.name.charAt(0).toUpperCase() : "A";

            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex flex-col justify-between rounded-3xl border ${themeConfig.border} ${themeConfig.bg} ${themeConfig.glow} p-7 transition-all duration-300 hover:scale-[1.02] min-h-[300px]`}
              >
                {/* Top Left Icon Badge */}
                <div className="flex items-center justify-between">
                  <div className={`${themeConfig.accent} opacity-90 transition-transform duration-300 hover:rotate-12`}>
                    {iconElement}
                  </div>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => handleDelete(note.id)}
                      title="Delete note"
                      className="text-gray-500 hover:text-rose-400 p-1 rounded-full transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Card Content Text */}
                <div className="my-auto py-6 text-center">
                  <p className="text-xl sm:text-2xl font-semibold tracking-wide text-white/95 leading-relaxed font-sans">
                    {note.content}
                  </p>
                </div>

                {/* Bottom Wavy Line SVG matching design screenshot */}
                <div className="w-full overflow-hidden leading-none pt-2">
                  <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-5 text-black/30"
                  >
                    <path
                      d="M0,0 C150,90 350,-40 500,45 C650,130 900,-30 1200,30 L1200,120 L0,120 Z"
                      fill={themeConfig.waveFill}
                    ></path>
                  </svg>
                </div>

                {/* Card Footer: User details & Like/Share actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-3">
                    {note.user?.image ? (
                      <Image
                        src={note.user.image}
                        alt={note.user.name || "User avatar"}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-white/20 object-cover"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full ${themeConfig.badgeBg} text-white flex items-center justify-center font-bold text-xs shadow-inner ring-2 ring-white/20`}
                      >
                        {userInitial}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-white/90 leading-tight">
                        {note.user?.name || "Anonymous Friend"}
                      </h4>
                      <p className="text-[11px] text-gray-400 font-light">{formattedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(note.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-pink-400 transition active:scale-125"
                      title="Like note"
                    >
                      <Heart className="w-3.5 h-3.5 fill-pink-500/20 text-pink-400" />
                      <span className="text-xs font-medium">{note.likesCount}</span>
                    </button>
                    <button
                      onClick={() => handleShare(note)}
                      className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
                      title="Share note"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* MODAL TO WRITE A NOTE */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-purple-500/30 bg-[#160d26] p-6 sm:p-8 shadow-2xl text-white"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Leave your mark</h3>
                  <p className="text-xs text-purple-300/70 font-light">
                    Share a thought, compliment, or warm wish on the wall
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-purple-200 mb-2">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    maxLength={300}
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Write something heartwarming..."
                    className="w-full rounded-2xl border border-purple-500/30 bg-purple-950/40 p-4 text-sm text-white placeholder-purple-300/40 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                    required
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-[11px] text-gray-400">
                      {formContent.length}/300
                    </span>
                  </div>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-medium text-purple-200 mb-2">
                    Choose Card Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(CARD_THEMES).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormTheme(key)}
                        className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium transition border ${
                          formTheme === key
                            ? "border-white bg-white/20 ring-2 ring-purple-400"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${cfg.badgeBg}`} />
                        <span className="truncate text-gray-200">{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="block text-xs font-medium text-purple-200 mb-2">
                    Choose Badge Icon
                  </label>
                  <div className="flex items-center gap-2">
                    {Object.entries(ICONS_MAP).map(([key, iconNode]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormIcon(key)}
                        className={`p-3 rounded-xl border transition ${
                          formIcon === key
                            ? "border-purple-400 bg-purple-600/30 text-purple-200 ring-2 ring-purple-400/50"
                            : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                        }`}
                      >
                        {iconNode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting || !formContent.trim()}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 active:scale-98"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Post to Wall of Love</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 rounded-full border border-purple-400/30 bg-[#1c0c35] px-5 py-3 text-xs font-medium text-purple-100 shadow-2xl backdrop-blur-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
