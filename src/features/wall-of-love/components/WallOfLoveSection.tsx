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
import { FaGoogle } from "react-icons/fa";

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

// Light-themed card palettes aligned with the project's periwinkle + neutral design system
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
    bg: "bg-gradient-to-b from-[#eef1fb] via-[#f3f5fd] to-white",
    border: "border-[#b0bde8]/50 hover:border-[#4a62b0]/40",
    accent: "text-[#4a62b0]",
    waveFill: "#f3f5fd",
    glow: "shadow-[0_4px_24px_rgba(74,98,176,0.10)]",
    badgeBg: "bg-[#4a62b0]",
    label: "Periwinkle",
  },
  emerald: {
    bg: "bg-gradient-to-b from-[#eaf6f0] via-[#f2fbf6] to-white",
    border: "border-emerald-200/60 hover:border-emerald-400/50",
    accent: "text-emerald-600",
    waveFill: "#f2fbf6",
    glow: "shadow-[0_4px_24px_rgba(16,185,129,0.10)]",
    badgeBg: "bg-emerald-500",
    label: "Sage Green",
  },
  violet: {
    bg: "bg-gradient-to-b from-[#f0eeff] via-[#f6f4ff] to-white",
    border: "border-violet-200/60 hover:border-violet-400/50",
    accent: "text-violet-600",
    waveFill: "#f6f4ff",
    glow: "shadow-[0_4px_24px_rgba(124,58,237,0.10)]",
    badgeBg: "bg-violet-500",
    label: "Soft Violet",
  },
  rose: {
    bg: "bg-gradient-to-b from-[#fef1f4] via-[#fff5f7] to-white",
    border: "border-rose-200/60 hover:border-rose-400/50",
    accent: "text-rose-500",
    waveFill: "#fff5f7",
    glow: "shadow-[0_4px_24px_rgba(244,63,94,0.10)]",
    badgeBg: "bg-rose-400",
    label: "Blush Rose",
  },
  amber: {
    bg: "bg-gradient-to-b from-[#fef8ec] via-[#fffbf2] to-white",
    border: "border-amber-200/60 hover:border-amber-400/50",
    accent: "text-amber-600",
    waveFill: "#fffbf2",
    glow: "shadow-[0_4px_24px_rgba(245,158,11,0.10)]",
    badgeBg: "bg-amber-500",
    label: "Warm Amber",
  },
  cyan: {
    bg: "bg-gradient-to-b from-[#ecf9fc] via-[#f3fbfd] to-white",
    border: "border-cyan-200/60 hover:border-cyan-400/50",
    accent: "text-cyan-600",
    waveFill: "#f3fbfd",
    glow: "shadow-[0_4px_24px_rgba(6,182,212,0.10)]",
    badgeBg: "bg-cyan-500",
    label: "Morning Cyan",
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

const LIKED_STORAGE_KEY = "siddhi_wall_liked_notes";

export default function WallOfLoveSection() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<WallNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedNoteIds, setLikedNoteIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formContent, setFormContent] = useState("");
  const [formTheme, setFormTheme] = useState("purple");
  const [formIcon, setFormIcon] = useState("sparkles");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load liked note IDs from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LIKED_STORAGE_KEY);
      if (saved) {
        setLikedNoteIds(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Sync liked note IDs to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(likedNoteIds));
    } catch {
      // Ignore localStorage errors
    }
  }, [likedNoteIds]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/wall-of-love");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setNotes(json.data);
        } else {
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
    } catch (err) {
      console.error("Failed to load Wall of Love notes:", err);
      setNotes([]);
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
          content: formContent.trim(),
          theme: formTheme,
          icon: formIcon,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setNotes((prev) => [json.data, ...prev]);
        setFormContent("");
        setIsModalOpen(false);
        showToast("Your mark has been left on the wall! ❤️");
      } else {
        showToast(json.message || "Failed to post note.");
      }
    } catch {
      showToast("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    const isAlreadyLiked = likedNoteIds.includes(id);

    // Toggle optimistic state
    if (isAlreadyLiked) {
      setLikedNoteIds((prev) => prev.filter((item) => item !== id));
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, likesCount: Math.max(0, n.likesCount - 1) } : n
        )
      );
    } else {
      setLikedNoteIds((prev) => [...prev, id]);
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, likesCount: n.likesCount + 1 } : n))
      );
      try {
        await fetch(`/api/wall-of-love/${id}/like`, { method: "POST" });
      } catch {
        // Ignore like sync errors silently
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast("Note deleted.");

    try {
      const res = await fetch(`/api/wall-of-love/${id}`, { method: "DELETE" });
      if (!res.ok) {
        fetchNotes();
      }
    } catch {
      fetchNotes();
    }
  };

  const handleShare = (note: WallNote) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `"${note.content}" — ${note.user?.name || "A friend"}`
      );
      showToast("Note text copied to clipboard! ✨");
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-surface)] text-[var(--color-text)] py-20 px-4 sm:px-6 lg:px-8">
      {/* Subtle soft radial ambient washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(211,222,250,0.55),transparent_60%),radial-gradient(ellipse_at_80%_90%,rgba(74,98,176,0.07),transparent_50%)]"
      />

      {/* Fine dot-grid texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(#4a62b0_1px,transparent_1px)] [background-size:20px_20px]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* ─── Section Header ─── */}
        <div className="text-center mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4a62b0]/60">
            THE WALL REMEMBERS
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-[var(--color-text)]">
            Words That Echo{" "}
            <span className="great-vibes-regular text-4xl sm:text-6xl lg:text-7xl font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#4a62b0] via-rose-400 to-violet-400 ml-1">
              Always
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-muted)] max-w-xl mx-auto pt-1 font-light">
            A cozy corner where kind words, notes, and quiet reflections are preserved forever.
          </p>
        </div>

        {/* ─── Grid Container ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">

          {/* CARD 1: JOIN THE WALL (Interactive Action Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col justify-between rounded-3xl border border-[#d3defa]/70 hover:border-[#4a62b0]/40 bg-gradient-to-b from-[#eef1fb] via-[#f3f5fd] to-white p-7 shadow-[0_4px_24px_rgba(74,98,176,0.10)] hover:shadow-[0_8px_36px_rgba(74,98,176,0.18)] transition-all duration-300 min-h-[300px]"
          >
            {/* Decorative sparkles */}
            <div className="absolute top-6 right-6 text-[#4a62b0]/30 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute bottom-16 left-6 text-[#4a62b0]/20">
              <Pencil className="w-5 h-5 -rotate-12" />
            </div>

            {/* Card Main Body */}
            <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
              <h3 className="great-vibes-regular text-3xl sm:text-4xl text-[#4a62b0]">
                &ldquo;Join the wall...&rdquo;
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[var(--color-muted)] font-light">
                {session?.user ? (
                  <>
                    Logged in as{" "}
                    <span className="font-medium text-[var(--color-text)]">
                      {session.user.name || session.user.email}
                    </span>
                  </>
                ) : (
                  "Sign in to leave your mark"
                )}
              </p>

              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#4a62b0]/30 bg-[#eef1fb] hover:bg-[#d3defa]/60 px-6 py-3 text-sm font-medium text-[#4a62b0] shadow-sm transition-all duration-300 hover:scale-105 hover:border-[#4a62b0]/60 active:scale-95"
              >
                <Pencil className="w-4 h-4 text-rose-400" />
                <span>Write a message...</span>
              </button>
            </div>

            {/* Bottom Wave Pattern SVG */}
            <div className="w-full overflow-hidden leading-none pt-4">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="relative block w-full h-5 text-[#f3f5fd]"
              >
                <path
                  d="M0,0 C150,90 350,-40 500,45 C650,130 900,-30 1200,30 L1200,120 L0,120 Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Card Footer: Login buttons indicator */}
            <div className="flex items-center justify-center gap-3 pt-3 border-t border-[#e4e8f2] text-xs text-[var(--color-muted)]">
              {!session ? (
                <button
                  onClick={() => signIn("google")}
                  title="Sign in with Google"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d3defa]/40 hover:bg-[#d3defa]/70 text-[#4a62b0] transition"
                >
                  <FaGoogle className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-xs">Sign in with Google</span>
                </button>
              ) : (
                <span className="text-xs text-[#4a62b0]/80 font-medium">
                  ✨ Ready to share your love
                </span>
              )}
            </div>
          </motion.div>

          {/* LOADING SPINNER STATE */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative md:col-span-1 lg:col-span-2 flex flex-col items-center justify-center rounded-3xl border border-[#d3defa]/60 bg-white/80 p-8 sm:p-12 min-h-[300px] text-center backdrop-blur-md shadow-[0_4px_20px_rgba(74,98,176,0.08)]"
            >
              <div className="relative flex items-center justify-center mb-5">
                <div className="absolute w-20 h-20 rounded-full bg-[#d3defa]/40 blur-xl animate-pulse" />
                <div className="w-14 h-14 rounded-full border-2 border-[#d3defa] border-t-[#4a62b0] border-r-rose-300 animate-spin" />
                <Heart className="w-5 h-5 text-rose-400 absolute fill-rose-300/40 animate-pulse" />
              </div>
              <h4 className="text-lg font-medium text-[var(--color-text)] mb-1">
                Gathering Echoes of Love...
              </h4>
              <p className="text-xs sm:text-sm text-[var(--color-muted)] font-light max-w-sm">
                Fetching warm notes and heartfelt messages from the wall.
              </p>
            </motion.div>
          ) : notes.length === 0 ? (
            /* EMPTY STATE: "BE THE FIRST ONE..." */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative md:col-span-1 lg:col-span-2 flex flex-col justify-between rounded-3xl border border-dashed border-[#4a62b0]/25 bg-white/70 p-8 sm:p-10 shadow-[0_4px_28px_rgba(74,98,176,0.08)] min-h-[300px] overflow-hidden backdrop-blur-md text-center"
            >
              {/* Ambient glows */}
              <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-rose-100/60 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#d3defa]/50 blur-3xl" />

              <div className="absolute top-6 left-6 text-[#4a62b0]/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="absolute top-6 right-6 text-rose-300/40">
                <Heart className="w-5 h-5 fill-rose-200/40" />
              </div>

              <div className="my-auto flex flex-col items-center justify-center py-6">
                <div className="relative mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#eef1fb] border border-[#d3defa]/60 flex items-center justify-center shadow-[0_4px_20px_rgba(74,98,176,0.12)]">
                    <Sparkles className="w-7 h-7 text-[#4a62b0] animate-pulse" />
                  </div>
                </div>

                <h3 className="great-vibes-regular text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#4a62b0] via-violet-500 to-rose-400">
                  Be the first one...
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[var(--color-muted)] max-w-md font-light leading-relaxed">
                  No messages on the wall yet. Be the first one to leave your mark, share a kind thought, or spread some love! ✨
                </p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-[#4a62b0]/30 bg-gradient-to-r from-[#4a62b0] via-violet-500 to-[#4a62b0] px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(74,98,176,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_28px_rgba(74,98,176,0.4)] active:scale-95"
                >
                  <Pencil className="w-4 h-4 text-[#d3defa]" />
                  <span>Be the first to write a note ✨</span>
                </button>
              </div>

              {/* Decorative wave at bottom */}
              <div className="w-full overflow-hidden leading-none pt-2 opacity-30">
                <svg
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                  className="relative block w-full h-4 text-[#d3defa]"
                >
                  <path
                    d="M0,0 C150,90 350,-40 500,45 C650,130 900,-30 1200,30 L1200,120 L0,120 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#e4e8f2] text-xs text-[var(--color-muted)]">
                <span>✨ This blank canvas is waiting for your kind words</span>
              </div>
            </motion.div>
          ) : (
            /* RENDERING TESTIMONIAL NOTE CARDS */
            notes.map((note, index) => {
              const themeConfig = CARD_THEMES[note.theme] || CARD_THEMES.purple;
              const iconElement = ICONS_MAP[note.icon] || (
                <Sparkles className="w-5 h-5" />
              );
              const isOwnerOrAdmin =
                session?.user &&
                (session.user.id === note.userId || session.user.role === "ADMIN");

              const formattedDate =
                typeof note.createdAt === "string" ||
                note.createdAt instanceof Date
                  ? new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "Recently";

              const userInitial = note.user?.name
                ? note.user.name.charAt(0).toUpperCase()
                : "A";

              const isLiked = likedNoteIds.includes(note.id);

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={`relative flex flex-col justify-between rounded-3xl border ${themeConfig.border} ${themeConfig.bg} ${themeConfig.glow} p-7 transition-all duration-300 hover:scale-[1.02] min-h-[300px]`}
                >
                  {/* Top Left Icon Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`${themeConfig.accent} opacity-90 transition-transform duration-300 hover:rotate-12`}
                    >
                      {iconElement}
                    </div>
                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => handleDelete(note.id)}
                        title="Delete note"
                        className="text-[var(--color-muted)] hover:text-rose-500 p-1 rounded-full transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Card Content Text */}
                  <div className="my-auto py-6 text-center">
                    <p className="text-xl sm:text-2xl font-semibold tracking-wide text-[var(--color-text)] leading-relaxed font-sans">
                      {note.content}
                    </p>
                  </div>

                  {/* Bottom Wavy Line SVG */}
                  <div className="w-full overflow-hidden leading-none pt-2">
                    <svg
                      viewBox="0 0 1200 120"
                      preserveAspectRatio="none"
                      className="relative block w-full h-5"
                    >
                      <path
                        d="M0,0 C150,90 350,-40 500,45 C650,130 900,-30 1200,30 L1200,120 L0,120 Z"
                        fill={themeConfig.waveFill}
                      />
                    </svg>
                  </div>

                  {/* Card Footer: User details & Like/Share actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#e4e8f2] text-xs">
                    <div className="flex items-center gap-3">
                      {note.user?.image ? (
                        <img
                          src={note.user.image}
                          alt={note.user?.name || "User avatar"}
                          className="w-8 h-8 rounded-full ring-2 ring-[#d3defa]/60 object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full ${themeConfig.badgeBg} text-white flex items-center justify-center font-bold text-xs shadow-inner ring-2 ring-white/60`}
                        >
                          {userInitial}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-[var(--color-text)] leading-tight">
                          {note.user?.name || "Anonymous Friend"}
                        </h4>
                        <p className="text-[11px] text-[var(--color-muted)] font-light">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLike(note.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition active:scale-125 ${
                          isLiked
                            ? "bg-rose-100 text-rose-500 ring-1 ring-rose-300/50"
                            : "bg-[#f7f9fd] hover:bg-[#eef1fb] text-[var(--color-muted)] hover:text-rose-500"
                        }`}
                        title={isLiked ? "Liked!" : "Like note"}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isLiked
                              ? "fill-rose-500 text-rose-500"
                              : "fill-rose-200/40 text-rose-400"
                          }`}
                        />
                        <span className="text-xs font-medium">
                          {note.likesCount}
                        </span>
                      </button>
                      <button
                        onClick={() => handleShare(note)}
                        className="p-1.5 rounded-full hover:bg-[#eef1fb] text-[var(--color-muted)] hover:text-[#4a62b0] transition"
                        title="Share note"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── MODAL TO WRITE A NOTE / AUTHENTICATE ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl border border-[#e4e8f2] bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(74,98,176,0.15)] text-[var(--color-text)]"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[#f7f9fd] transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-[#eef1fb] text-[#4a62b0] border border-[#d3defa]/60">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--color-text)]">Leave your mark</h3>
                  <p className="text-xs text-[var(--color-muted)] font-light">
                    Share a thought, compliment, or warm wish on the wall
                  </p>
                </div>
              </div>

              {!session ? (
                /* Prompt to sign in if not logged in */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#eef1fb] border border-[#d3defa]/60 flex items-center justify-center text-[#4a62b0] shadow-[0_4px_20px_rgba(74,98,176,0.12)]">
                    <Heart className="w-7 h-7 text-rose-400 fill-rose-200/40 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--color-text)]">
                      Sign in to leave your mark
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--color-muted)] max-w-xs mx-auto mt-1 font-light">
                      Sign in with Google to post your message on the wall.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col gap-3 max-w-xs mx-auto">
                    <button
                      type="button"
                      onClick={() => signIn("google")}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-[#f7f9fd] text-[var(--color-text)] font-medium py-3 px-4 border border-[#e4e8f2] shadow-sm transition hover:scale-[1.02] active:scale-98 text-sm"
                    >
                      <FaGoogle className="w-4 h-4 text-emerald-500" />
                      <span>Continue with Google</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Message form for authenticated users */
                <form onSubmit={handleCreateNote} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text)] mb-2">
                      Your Message
                    </label>
                    <textarea
                      rows={4}
                      maxLength={300}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      placeholder="Write something heartwarming..."
                      className="w-full rounded-2xl border border-[#e4e8f2] bg-[#f7f9fd] p-4 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)]/50 focus:border-[#4a62b0] focus:outline-none focus:ring-2 focus:ring-[#4a62b0]/15 resize-none"
                      required
                    />
                    <div className="flex justify-end mt-1">
                      <span className="text-[11px] text-[var(--color-muted)]">
                        {formContent.length}/300
                      </span>
                    </div>
                  </div>

                  {/* Theme Selector */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text)] mb-2">
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
                              ? "border-[#4a62b0] bg-[#eef1fb] ring-2 ring-[#4a62b0]/30"
                              : "border-[#e4e8f2] bg-[#f7f9fd] hover:bg-[#eef1fb] hover:border-[#d3defa]"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded-full ${cfg.badgeBg}`}
                          />
                          <span className="truncate text-[var(--color-text)]">
                            {cfg.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text)] mb-2">
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
                              ? "border-[#4a62b0] bg-[#eef1fb] text-[#4a62b0] ring-2 ring-[#4a62b0]/25"
                              : "border-[#e4e8f2] bg-[#f7f9fd] text-[var(--color-muted)] hover:text-[#4a62b0] hover:bg-[#eef1fb]"
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
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4a62b0] to-violet-500 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(74,98,176,0.30)] transition hover:from-[#3a4f96] hover:to-violet-600 hover:shadow-[0_6px_24px_rgba(74,98,176,0.40)] disabled:opacity-50 active:scale-98"
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
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── TOAST NOTIFICATION ─── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 rounded-full border border-[#d3defa]/60 bg-white px-5 py-3 text-xs font-medium text-[var(--color-text)] shadow-[0_8px_30px_rgba(74,98,176,0.18)] backdrop-blur-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#4a62b0]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
