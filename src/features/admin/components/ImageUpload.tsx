"use client";

import { useState, useRef, useId } from "react";
import axios from "axios";
import {
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Cloud,
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label?: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  label,
  description,
  value,
  onChange,
  folder = "siddhyy",
  className,
  placeholder = "Upload an image or enter a URL",
}: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [copied, setCopied] = useState(false);

  const isCloudinary = value?.includes("cloudinary.com");

  async function handleUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast({
        tone: "error",
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, WebP, GIF, etc.).",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        tone: "error",
        title: "File too large",
        description: "Image size must be 10MB or less.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await axios.post("/api/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = response.data?.data?.url;
      if (uploadedUrl) {
        onChange(uploadedUrl);
        toast({
          tone: "success",
          title: "Image uploaded to Cloudinary",
        });
      } else {
        throw new Error("No URL returned from server.");
      }
    } catch (err: unknown) {
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to upload image. Please check your connection.";
      toast({
        tone: "error",
        title: "Upload failed",
        description: errorMsg,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleUpload(file);
    }
  }

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        {label ? (
          <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        ) : <div />}

        <button
          type="button"
          onClick={() => setShowUrlInput((prev) => !prev)}
          className="text-xs text-muted hover:text-link transition flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="h-3 w-3" />
          {showUrlInput ? "Hide URL input" : "Paste image URL"}
        </button>
      </div>

      {description ? (
        <p className="text-xs text-muted">{description}</p>
      ) : null}

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {/* Manual URL input toggle */}
      {showUrlInput && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-xs focus-within:border-link transition">
          <LinkIcon className="h-4 w-4 text-muted shrink-0" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/... or any image URL"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted/60"
          />
          {value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-muted hover:text-danger p-0.5 rounded transition cursor-pointer"
              title="Clear URL"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      )}

      {/* Image Preview / Upload Area */}
      {value ? (
        <div className="relative rounded-2xl border border-border bg-surface/50 p-3 shadow-xs transition hover:border-border/80">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Image Thumbnail */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
              <img
                src={value}
                alt="Uploaded preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='none' stroke='%23999'><rect width='100' height='100' fill='%23f1f1f1'/><text x='50' y='55' font-size='12' text-anchor='middle' fill='%23888'>Broken URL</text></svg>";
                }}
              />
            </div>

            {/* Info and Actions */}
            <div className="flex-1 min-w-0 space-y-2 w-full text-left">
              <div className="flex flex-wrap items-center gap-2">
                {isCloudinary ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 border border-sky-200">
                    <Cloud className="h-3 w-3" />
                    Cloudinary Hosted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-700 border border-stone-200">
                    <ImageIcon className="h-3 w-3" />
                    External Image
                  </span>
                )}
              </div>

              <p className="text-xs text-muted truncate max-w-md font-mono" title={value}>
                {value}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface shadow-2xs transition cursor-pointer disabled:opacity-50"
                >
                  <UploadCloud className="h-3.5 w-3.5 text-link" />
                  Replace image
                </button>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-medium text-muted hover:text-foreground hover:bg-surface shadow-2xs transition cursor-pointer"
                  title="Copy URL"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy URL
                    </>
                  )}
                </button>

                <a
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-medium text-muted hover:text-link hover:bg-surface shadow-2xs transition no-underline"
                  title="Open original image"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View
                </a>

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 shadow-2xs transition cursor-pointer ml-auto"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Uploading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-sm font-medium text-link">
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading to Cloudinary…
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty / Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer",
            isDragging
              ? "border-link bg-link/5"
              : "border-border/80 bg-surface/30 hover:border-link/60 hover:bg-surface/60",
            isUploading && "pointer-events-none opacity-80",
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="h-8 w-8 animate-spin text-link" />
              <p className="text-sm font-medium text-foreground">
                Uploading to Cloudinary…
              </p>
              <p className="text-xs text-muted">Optimizing and storing your image</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft border border-border group-hover:scale-105 transition">
                <UploadCloud className="h-6 w-6 text-link" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-muted">
                  Direct upload to Cloudinary (PNG, JPG, WebP, GIF up to 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
