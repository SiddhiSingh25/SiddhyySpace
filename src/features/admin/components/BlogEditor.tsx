"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  UploadCloud,
  Link as LinkIcon,
  X,
  Loader2,
  Check,
  Film,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import "react-quill-new/dist/quill.snow.css";

// Dynamically load ReactQuill on the client only
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-xl border border-border bg-white text-sm text-muted">
      Loading rich editor…
    </div>
  ),
}) as React.ComponentType<any>;

type BlogEditorProps = {
  value: unknown;
  onChange: (value: string) => void;
};

// Convert legacy TipTap JSON doc or object to HTML string
function normalizeToHtml(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const node = value as {
      type?: string;
      text?: string;
      content?: unknown[];
      attrs?: Record<string, unknown>;
      marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
    };

    if (node.type === "doc") {
      return (node.content || []).map(normalizeToHtml).join("");
    }
    if (node.type === "paragraph") {
      const inner = (node.content || []).map(normalizeToHtml).join("");
      return `<p>${inner || "<br>"}</p>`;
    }
    if (node.type === "heading") {
      const level = Number(node.attrs?.level ?? 2);
      const inner = (node.content || []).map(normalizeToHtml).join("");
      return `<h${level}>${inner}</h${level}>`;
    }
    if (node.type === "bulletList") {
      return `<ul>${(node.content || []).map(normalizeToHtml).join("")}</ul>`;
    }
    if (node.type === "orderedList") {
      return `<ol>${(node.content || []).map(normalizeToHtml).join("")}</ol>`;
    }
    if (node.type === "listItem") {
      return `<li>${(node.content || []).map(normalizeToHtml).join("")}</li>`;
    }
    if (node.type === "blockquote") {
      return `<blockquote>${(node.content || []).map(normalizeToHtml).join("")}</blockquote>`;
    }
    if (node.type === "image") {
      return `<img src="${node.attrs?.src || ""}" alt="${node.attrs?.alt || ""}" />`;
    }
    if (node.type === "youtube" || node.type === "iframe") {
      return `<iframe src="${node.attrs?.src || ""}" frameborder="0" allowfullscreen></iframe>`;
    }
    if (node.type === "text") {
      let t = node.text || "";
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === "bold") t = `<strong>${t}</strong>`;
          if (mark.type === "italic") t = `<em>${t}</em>`;
          if (mark.type === "code") t = `<code>${t}</code>`;
          if (mark.type === "link")
            t = `<a href="${mark.attrs?.href || "#"}">${t}</a>`;
        }
      }
      return t;
    }
  }

  return "";
}

function formatVideoEmbedUrl(url: string): { embedUrl: string; isDirect: boolean } {
  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      isDirect: false,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isDirect: false,
    };
  }

  // Direct MP4 / WebM / MOV video file or Cloudinary video
  const isDirect =
    /\.(mp4|webm|mov|ogg)($|\?)/i.test(trimmed) ||
    trimmed.includes("/video/upload/");
  return { embedUrl: trimmed, isDirect };
}

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null);

  const [editorHtml, setEditorHtml] = useState<string>(() =>
    normalizeToHtml(value),
  );

  // Register HTML5 Video blot in Quill on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("quill")
        .then(({ default: Quill }) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const BlockEmbed = Quill.import("blots/block/embed") as any;
            if (BlockEmbed) {
              class Html5VideoBlot extends BlockEmbed {
                static blotName = "html5video";
                static tagName = "VIDEO";
                static className = "ql-video-player";

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                static create(value: any) {
                  const node = super.create(value);
                  node.setAttribute("controls", "true");
                  node.setAttribute("playsinline", "true");
                  const src =
                    typeof value === "string" ? value : value?.src || "";
                  node.setAttribute("src", src);
                  node.style.maxWidth = "100%";
                  node.style.borderRadius = "1rem";
                  node.style.display = "block";
                  node.style.margin = "1.5rem auto";
                  return node;
                }

                static value(domNode: HTMLElement) {
                  return domNode.getAttribute("src");
                }
              }
              Quill.register(Html5VideoBlot, true);
            }
          } catch {
            // Quill already registered
          }
        })
        .catch(() => {});
    }
  }, []);

  // Sync if value updates from outside
  useEffect(() => {
    const normalized = normalizeToHtml(value);
    if (normalized !== editorHtml) {
      setEditorHtml(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Image Modal State
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageSourceMode, setImageSourceMode] = useState<"file" | "url">("file");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageWidth, setImageWidth] = useState<"100%" | "75%" | "50%" | "33%">("100%");
  const [imageCropMode, setImageCropMode] = useState<"none" | "16-9" | "4-3" | "1-1">("none");
  const [imageUploading, setImageUploading] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Video Modal State
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoSourceMode, setVideoSourceMode] = useState<"url" | "file">("url");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoWidth, setVideoWidth] = useState<"100%" | "75%" | "50%">("100%");
  const [videoUploading, setVideoUploading] = useState(false);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(content: string) {
    setEditorHtml(content);
    onChange(content);
  }

  // Apply smooth headings
  function applyHeading(level: 1 | 2 | 3 | false) {
    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    if (!quill) return;
    quill.focus();
    quill.format("header", level);
  }

  // Handle Image File Selection
  async function handleImageFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ tone: "error", title: "Please choose an image file (PNG, JPG, WebP)." });
      return;
    }

    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "siddhyy-blogs");

      const { data } = await axios.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = data?.data?.url;
      if (url) {
        setImageUrl(url);
        setImagePreview(url);
        toast({ tone: "success", title: "Image uploaded to Cloudinary!" });
      }
    } catch {
      toast({ tone: "error", title: "Could not upload image." });
    } finally {
      setImageUploading(false);
    }
  }

  // Insert Image into Quill
  function insertImageIntoEditor() {
    if (!imageUrl.trim()) {
      toast({ tone: "error", title: "Please provide an image URL or upload a file." });
      return;
    }

    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true) || { index: quill.getLength() };

    let style = `width: ${imageWidth}; max-width: 100%; border-radius: 1rem; margin: 1.5rem auto; display: block;`;
    if (imageCropMode === "16-9") {
      style += " aspect-ratio: 16 / 9; object-fit: cover;";
    } else if (imageCropMode === "4-3") {
      style += " aspect-ratio: 4 / 3; object-fit: cover;";
    } else if (imageCropMode === "1-1") {
      style += " aspect-ratio: 1 / 1; object-fit: cover;";
    }

    const imageHtml = `<p><img src="${imageUrl.trim()}" style="${style}" alt="Blog photo" /></p>`;

    quill.clipboard.dangerouslyPasteHTML(range.index, imageHtml);
    quill.setSelection(range.index + 1);

    // Reset and close
    setImageModalOpen(false);
    setImageUrl("");
    setImagePreview("");
    setImageCropMode("none");
    setImageWidth("100%");
  }

  // Handle Video File Selection
  async function handleVideoFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({ tone: "error", title: "Please choose a valid video file (MP4, WebM, MOV)." });
      return;
    }

    setVideoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "siddhyy-blogs");

      const { data } = await axios.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = data?.data?.url;
      if (url) {
        setVideoUrl(url);
        toast({ tone: "success", title: "Video uploaded successfully!" });
      }
    } catch {
      toast({ tone: "error", title: "Could not upload video. Max 50MB." });
    } finally {
      setVideoUploading(false);
    }
  }

  // Insert Video into Quill
  function insertVideoIntoEditor() {
    if (!videoUrl.trim()) {
      toast({ tone: "error", title: "Please enter a video URL or upload a file." });
      return;
    }

    if (!quillRef.current) return;
    const quill = quillRef.current.getEditor();
    if (!quill) return;

    const range = quill.getSelection(true) || { index: quill.getLength() };
    const { embedUrl, isDirect } = formatVideoEmbedUrl(videoUrl.trim());

    let videoHtml = "";
    if (isDirect) {
      videoHtml = `<p><video controls src="${embedUrl}" style="width: ${videoWidth}; max-width: 100%; border-radius: 1rem; margin: 1.5rem auto; display: block;"></video></p>`;
    } else {
      videoHtml = `<p><iframe src="${embedUrl}" style="width: ${videoWidth}; aspect-ratio: 16 / 9; border-radius: 1rem; margin: 1.5rem auto; display: block;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></p>`;
    }

    quill.clipboard.dangerouslyPasteHTML(range.index, videoHtml);
    quill.setSelection(range.index + 1);

    // Reset and close
    setVideoModalOpen(false);
    setVideoUrl("");
    setVideoWidth("100%");
  }

  // Quill Modules definition
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  return (
    <div className="space-y-3">
      {/* Quick Action Bar for H1, H2, Smooth Media Insertion */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface/70 p-2.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted px-1.5">
            Headings:
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs font-bold"
            onClick={() => applyHeading(1)}
            title="Heading 1"
          >
            <Heading1 className="h-3.5 w-3.5 mr-1 text-link" />
            H1
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs font-semibold"
            onClick={() => applyHeading(2)}
            title="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5 mr-1 text-link" />
            H2
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 px-2.5 text-xs font-medium"
            onClick={() => applyHeading(3)}
            title="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5 mr-1 text-muted" />
            H3
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-xs text-muted"
            onClick={() => applyHeading(false)}
            title="Normal Paragraph"
          >
            Normal (P)
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-8 bg-white text-xs font-medium shadow-sm hover:border-link"
            onClick={() => setImageModalOpen(true)}
          >
            <ImageIcon className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
            Add Photo / Image
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-8 bg-white text-xs font-medium shadow-sm hover:border-link"
            onClick={() => setVideoModalOpen(true)}
          >
            <VideoIcon className="h-3.5 w-3.5 mr-1.5 text-rose-600" />
            Add Video
          </Button>
        </div>
      </div>

      {/* ReactQuill Editor */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-soft">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={editorHtml}
          onChange={handleChange}
          modules={modules}
          placeholder="Start writing your article… Use the toolbar or buttons above to add H1/H2, photos, videos, and styling."
        />
      </div>

      {/* IMAGE / PHOTO MODAL */}
      {imageModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-foreground">Insert Photo / Image</h3>
              </div>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:bg-surface hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Source Mode Tabs */}
            <div className="mt-4 flex rounded-xl border border-border bg-surface p-1 text-xs">
              <button
                type="button"
                onClick={() => setImageSourceMode("file")}
                className={`flex-1 rounded-lg py-1.5 font-medium transition ${
                  imageSourceMode === "file"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Upload File from Computer
              </button>
              <button
                type="button"
                onClick={() => setImageSourceMode("url")}
                className={`flex-1 rounded-lg py-1.5 font-medium transition ${
                  imageSourceMode === "url"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Enter Image URL
              </button>
            </div>

            {/* Upload or URL Input */}
            <div className="mt-4 space-y-4">
              {imageSourceMode === "file" ? (
                <div>
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => imageFileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/50 p-6 text-center hover:border-link transition"
                  >
                    {imageUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-link" />
                        <p className="mt-2 text-xs font-medium text-muted">
                          Uploading to Cloudinary…
                        </p>
                      </>
                    ) : imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mx-auto max-h-36 rounded-lg object-contain shadow-sm"
                        />
                        <p className="text-xs text-link font-medium">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-muted" />
                        <p className="mt-2 text-sm font-medium text-foreground">
                          Click to browse and upload image
                        </p>
                        <p className="text-xs text-muted">PNG, JPG, WebP up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted">Image Web URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-link"
                    />
                  </div>
                </div>
              )}

              {/* Sizing & Aspect Ratio / Crop Options */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-surface/40 p-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    Display Width:
                  </label>
                  <select
                    value={imageWidth}
                    onChange={(e) =>
                      setImageWidth(e.target.value as "100%" | "75%" | "50%" | "33%")
                    }
                    className="h-9 w-full rounded-lg border border-border bg-white px-2.5 text-xs font-medium"
                  >
                    <option value="100%">Full Width (100%)</option>
                    <option value="75%">Medium (75%)</option>
                    <option value="50%">Half Width (50%)</option>
                    <option value="33%">Compact (33%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    Crop / Aspect Ratio:
                  </label>
                  <select
                    value={imageCropMode}
                    onChange={(e) =>
                      setImageCropMode(
                        e.target.value as "none" | "16-9" | "4-3" | "1-1",
                      )
                    }
                    className="h-9 w-full rounded-lg border border-border bg-white px-2.5 text-xs font-medium"
                  >
                    <option value="none">Original (No Crop)</option>
                    <option value="16-9">Landscape (16:9)</option>
                    <option value="4-3">Standard (4:3)</option>
                    <option value="1-1">Square (1:1)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImageModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={insertImageIntoEditor}
                disabled={imageUploading || !imageUrl.trim()}
              >
                <Check className="h-4 w-4 mr-1" />
                Insert Image
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* VIDEO MODAL */}
      {videoModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5 text-rose-600" />
                <h3 className="font-semibold text-foreground">Insert Video</h3>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="rounded-lg p-1 text-muted hover:bg-surface hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Source Mode Tabs */}
            <div className="mt-4 flex rounded-xl border border-border bg-surface p-1 text-xs">
              <button
                type="button"
                onClick={() => setVideoSourceMode("url")}
                className={`flex-1 rounded-lg py-1.5 font-medium transition ${
                  videoSourceMode === "url"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                YouTube / Vimeo / Video URL
              </button>
              <button
                type="button"
                onClick={() => setVideoSourceMode("file")}
                className={`flex-1 rounded-lg py-1.5 font-medium transition ${
                  videoSourceMode === "file"
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted hover:text-foreground"
                }`}
              >
                Upload Video File (MP4)
              </button>
            </div>

            {/* Upload or URL Input */}
            <div className="mt-4 space-y-4">
              {videoSourceMode === "file" ? (
                <div>
                  <input
                    ref={videoFileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface/50 p-6 text-center hover:border-link transition"
                  >
                    {videoUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-link" />
                        <p className="mt-2 text-xs font-medium text-muted">
                          Uploading video to Cloudinary… (Max 50MB)
                        </p>
                      </>
                    ) : videoUrl ? (
                      <div className="space-y-2">
                        <Film className="mx-auto h-10 w-10 text-emerald-600" />
                        <p className="text-xs font-medium text-emerald-700">
                          Video ready to insert!
                        </p>
                        <p className="text-xs text-muted truncate max-w-xs mx-auto">
                          {videoUrl}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Film className="h-8 w-8 text-muted" />
                        <p className="mt-2 text-sm font-medium text-foreground">
                          Click to browse and upload video
                        </p>
                        <p className="text-xs text-muted">
                          MP4, WebM, MOV supported (up to 50MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted">
                    YouTube, Vimeo, or MP4 URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or .mp4 URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="h-10 w-full rounded-xl border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-link"
                    />
                  </div>
                  <p className="text-xs text-muted">
                    Supports YouTube links, Vimeo, and direct video links.
                  </p>
                </div>
              )}

              {/* Sizing Options */}
              <div className="rounded-xl border border-border bg-surface/40 p-3">
                <label className="block text-xs font-medium text-muted mb-1.5">
                  Video Player Width:
                </label>
                <select
                  value={videoWidth}
                  onChange={(e) =>
                    setVideoWidth(e.target.value as "100%" | "75%" | "50%")
                  }
                  className="h-9 w-full rounded-lg border border-border bg-white px-2.5 text-xs font-medium"
                >
                  <option value="100%">Full Width (100%)</option>
                  <option value="75%">Medium (75%)</option>
                  <option value="50%">Half Width (50%)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setVideoModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={insertVideoIntoEditor}
                disabled={videoUploading || !videoUrl.trim()}
              >
                <Check className="h-4 w-4 mr-1" />
                Insert Video
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
