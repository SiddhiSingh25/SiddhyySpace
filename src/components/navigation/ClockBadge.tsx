"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type ClockBadgeProps = {
  className?: string;
  compact?: boolean;
};

export function ClockBadge({ className, compact = false }: ClockBadgeProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/80 px-2.5 py-1 text-xs font-medium text-muted shadow-xs backdrop-blur-xs transition-colors hover:border-link/30 hover:text-foreground",
        className
      )}
      title="India Standard Time (IST) · Asia/Kolkata"
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      <Clock className="h-3 w-3 shrink-0 text-muted/70" />
      <span className="tabular-nums tracking-tight">
        {compact ? time || "IST" : `India${time ? ` · ${time}` : ""}`}
      </span>
    </span>
  );
}
