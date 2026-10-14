"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmailCopyButton({
  email = "singhsiddhi960@gmail.com",
  className,
}: {
  email?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground shadow-sm hover:border-foreground/30 hover:bg-surface transition-all cursor-pointer",
        className
      )}
      title="Copy email to clipboard"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-success" />
          <span className="text-success font-medium">Copied to Clipboard!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4 text-muted" />
          <span>Copy Email Address</span>
        </>
      )}
    </button>
  );
}
