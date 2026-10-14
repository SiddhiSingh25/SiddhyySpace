"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

type ShareButtonProps = {
  slug: string;
  className?: string;
};

export default function ShareButton({ slug, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/products/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this product",
          url,
        });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Share failed", error);
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleShare}
      variant="secondary"
      size="md"
      className={className}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
      <span>{copied ? "Copied!" : "Share"}</span>
    </Button>
  );
}

