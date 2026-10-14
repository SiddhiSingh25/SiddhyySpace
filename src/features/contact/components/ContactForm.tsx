"use client";

import { Mail } from "lucide-react";
import { EmailCopyButton } from "./EmailCopyButton";

export function ContactForm() {
  const email = "singhsiddhi960@gmail.com";

  return (
    <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-surface to-background p-8 sm:p-10 text-center shadow-soft backdrop-blur space-y-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-link border border-primary/30">
        <Mail className="h-7 w-7" />
      </div>

      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Official Email
        </p>
        <a
          href={`mailto:${email}`}
          className="font-display text-2xl sm:text-3xl font-medium text-foreground hover:text-link transition-colors block break-all no-underline"
        >
          {email}
        </a>
      </div>

      <p className="text-xs sm:text-sm text-muted max-w-sm mx-auto leading-relaxed">
        For any queries, feedback, or collaborations, feel free to reach out directly.
      </p>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs sm:text-sm font-medium text-background shadow-sm hover:bg-foreground/90 transition-all no-underline cursor-pointer"
        >
          <Mail className="h-4 w-4" />
          <span>Send an Email</span>
        </a>
        <EmailCopyButton email={email} />
      </div>
    </div>
  );
}
