"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AdminHeroPage() {
  const { toast } = useToast();

  const [headline, setHeadline] = useState("");
  const [subheading, setSubheading] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaHref, setCtaHref] = useState("");
  const [image, setImage] = useState("");
  const [background, setBackground] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await axios.get("/api/admin/hero");
        if (data.data) {
          const h = data.data;
          setHeadline(h.headline ?? "");
          setSubheading(h.subheading ?? "");
          setCtaLabel(h.ctaLabel ?? "");
          setCtaHref(h.ctaHref ?? "");
          setImage(h.image ?? "");
          setBackground(h.background ?? "");
          setIsActive(h.isActive ?? true);
        } else {
          setHeadline("A quiet space for thought and code.");
          setSubheading("Writing on software, craft, and ideas.");
          setCtaLabel("Read the latest");
          setCtaHref("/blogs");
        }
      } catch {
        toast({ tone: "error", title: "Could not load hero configuration." });
      } finally {
        setReady(true);
      }
    }
    void loadData();
  }, [toast]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/admin/hero", {
        headline,
        subheading: subheading || null,
        ctaLabel: ctaLabel || null,
        ctaHref: ctaHref || null,
        image: image || null,
        background: background || null,
        isActive,
      });

      toast({ tone: "success", title: "Hero section saved successfully." });
    } catch {
      toast({ tone: "error", title: "Could not save hero section." });
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading hero settings…</p>;
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Hero Section"
        description="Configure the primary introduction, headline, and call to action on the landing page."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
          >
            <Input
              label="Headline *"
              placeholder="e.g. A quiet space for thought and code."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />

            <Textarea
              label="Subheading / Tagline"
              placeholder="e.g. Writing on software, design systems, curated reads, and mindful craft."
              rows={3}
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="CTA Button Label"
                placeholder="e.g. Read the latest"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
              />
              <Input
                label="CTA Button Link"
                placeholder="e.g. /blogs or https://..."
                value={ctaHref}
                onChange={(e) => setCtaHref(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Hero Avatar / Image URL"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Input
                label="Background Pattern / Color"
                placeholder="e.g. radial-gradient..."
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              />
            </div>

            <Toggle
              label="Hero Section Active"
              description="Turn off to temporarily hide this hero banner"
              checked={isActive}
              onChange={setIsActive}
            />

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" loading={loading}>
                Save hero section
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Sparkles className="h-3.5 w-3.5 text-link" />
              <span>Live Visual Preview</span>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft transition">
              <div className="space-y-4">
                {image ? (
                  <img
                    src={image}
                    alt="Hero preview"
                    className="h-16 w-16 rounded-2xl object-cover shadow-sm border border-border"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl bg-primary/40 flex items-center justify-center text-link font-display text-2xl font-bold">
                    S
                  </div>
                )}

                <h2 className="font-display text-2xl font-medium tracking-tight text-foreground text-balance">
                  {headline || "Your headline will appear here"}
                </h2>

                <p className="text-sm text-muted leading-relaxed">
                  {subheading || "Your introductory subheading will appear here."}
                </p>

                {ctaLabel ? (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-white shadow-sm">
                      {ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                ) : null}
              </div>

              {!isActive && (
                <div className="absolute top-3 right-3 rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                  INACTIVE
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
