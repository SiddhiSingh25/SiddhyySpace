"use client";

import { useState, useRef } from "react";
import axios from "axios";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  UploadCloud,
  Link as LinkIcon,
  X,
  Loader2,
  Trash2,
  Film,
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { isVideoUrl, isDirectVideoUrl, toVideoEmbedUrl } from "@/utils/media";

interface CoverMediaUploadProps {
  label?: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function CoverMediaUpload({
  label = "Cover Media",
  description = "Add a photo or video to display at the top of your blog post.",
  value,
  onChange,
  folder = "siddhyy-blogs",
}: CoverMediaUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"image" | "video">(() =>
    isVideoUrl(value) ? "video" : "image",
  );
  const [sourceMode, setSourceMode] = useState<"file" | "url">("file");
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const hasValue = Boolean(value?.trim());
  const isCurrentVideo = isVideoUrl(value);

  // Handle file uploads (image or video)
  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (activeTab === "image" && !file.type.startsWith("image/")) {
      toast({
        tone: "error",
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WebP).",
      });
      return;
    }

    if (activeTab === "video" && !file.type.startsWith("video/")) {
      toast({
        tone: "error",
        title: "Invalid file type",
        description: "Please select a video file (MP4, WebM, MOV).",
      });
      return;
    }

    const maxSizeBytes =
      activeTab === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        tone: "error",
        title: "File too large",
        description: `File must be under ${activeTab === "video" ? "50MB" : "10MB"}.`,
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const { data } = await axios.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = data?.data?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
        setIsEditing(false);
        toast({
          tone: "success",
          title: `${activeTab === "video" ? "Video" : "Image"} uploaded!`,
        });
      }
    } catch {
      toast({
        tone: "error",
        title: "Upload failed",
        description: "Could not upload media. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function handleUrlApply() {
    if (!urlInput.trim()) {
      toast({ tone: "error", title: "Please enter a valid URL." });
      return;
    }
    onChange(urlInput.trim());
    setUrlInput("");
    setIsEditing(false);
    toast({ tone: "success", title: "Cover media updated!" });
  }

  function handleClear() {
    onChange("");
    setUrlInput("");
    setIsEditing(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
          {description ? (
            <p className="text-xs text-muted">{description}</p>
          ) : null}
        </div>

        {hasValue && !isEditing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-link hover:underline"
            >
              Change
            </button>
            <span className="text-muted">•</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-rose-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Remove
            </button>
          </div>
        ) : null}
      </div>

      {/* EXISTING MEDIA PREVIEW (WHEN NOT EDITING) */}
      {hasValue && !isEditing ? (
        <div className="relative overflow-hidden rounded-2xl border border-border bg-black/5 shadow-soft">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {isCurrentVideo ? (
              <>
                <Film className="h-3.5 w-3.5 text-rose-400" />
                <span>Video Cover</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>Photo Cover</span>
              </>
            )}
          </div>

          <div className="aspect-[16/9] w-full overflow-hidden">
            {isCurrentVideo ? (
              isDirectVideoUrl(value) ? (
                <video
                  controls
                  playsInline
                  src={value}
                  className="h-full w-full object-cover bg-black"
                />
              ) : (
                <iframe
                  src={toVideoEmbedUrl(value)}
                  className="h-full w-full"
                  allowFullScreen
                />
              )
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      ) : (
        /* EDIT / UPLOAD INTERFACE */
        <div className="rounded-2xl border border-border bg-white p-4 shadow-soft space-y-4">
          {/* Main Tabs: Image vs Video */}
          <div className="flex rounded-xl border border-border bg-surface p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab("image");
                setUrlInput("");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 font-medium transition ${
                activeTab === "image"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              <span>Image Cover</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("video");
                setUrlInput("");
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 font-medium transition ${
                activeTab === "video"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <VideoIcon className="h-4 w-4 text-rose-600" />
              <span>Video Cover (.mp4, YouTube, Vimeo)</span>
            </button>
          </div>

          {/* Sub-Tabs: File vs URL */}
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setSourceMode("file")}
              className={`px-3 py-1 rounded-lg border transition ${
                sourceMode === "file"
                  ? "border-link bg-link/10 font-medium text-link"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {activeTab === "video" ? "Upload MP4 File" : "Upload Image File"}
            </button>
            <button
              type="button"
              onClick={() => setSourceMode("url")}
              className={`px-3 py-1 rounded-lg border transition ${
                sourceMode === "url"
                  ? "border-link bg-link/10 font-medium text-link"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              Enter Web URL
            </button>
          </div>

          {/* Source Input */}
          {sourceMode === "file" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={activeTab === "video" ? "video/*" : "image/*"}
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/40 p-6 text-center hover:border-link transition"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-link" />
                    <p className="mt-2 text-xs font-medium text-muted">
                      Uploading to Cloudinary…
                    </p>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-8 w-8 text-muted" />
                    <p className="mt-2 text-sm font-medium text-foreground">
                      Click to choose {activeTab === "video" ? "an MP4 video file" : "an image file"}
                    </p>
                    <p className="text-xs text-muted">
                      {activeTab === "video"
                        ? "MP4, WebM, MOV supported (up to 50MB)"
                        : "PNG, JPG, WebP supported (up to 10MB)"}
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <input
                  type="url"
                  placeholder={
                    activeTab === "video"
                      ? "https://www.youtube.com/watch?v=... or direct .mp4 URL"
                      : "https://example.com/cover.jpg"
                  }
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-link"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                {hasValue && isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs text-muted hover:text-foreground"
                  >
                    Cancel
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleUrlApply}
                  className="rounded-lg bg-foreground px-4 py-1.5 text-xs font-medium text-white hover:opacity-90"
                >
                  Set as Cover
                </button>
              </div>
            </div>
          )}

          {hasValue && isEditing ? (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs text-muted hover:text-foreground"
              >
                Keep current cover
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
