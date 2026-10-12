"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { User, Sparkles } from "lucide-react";

export default function AdminAboutPage() {
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [biography, setBiography] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Social links
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [spotify, setSpotify] = useState("");
  const [youtube, setYoutube] = useState("");

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await axios.get("/api/admin/about");
        if (data.data) {
          const ab = data.data;
          setTitle(ab.title ?? "");
          setBiography(ab.biography ?? "");
          setImage(ab.image ?? "");
          setIsActive(ab.isActive ?? true);

          const links = (ab.socialLinks as Record<string, string>) || {};
          setTwitter(links.twitter ?? "");
          setGithub(links.github ?? "");
          setInstagram(links.instagram ?? "");
          setLinkedin(links.linkedin ?? "");
          setSpotify(links.spotify ?? "");
          setYoutube(links.youtube ?? "");
        }
      } catch {
        toast({ tone: "error", title: "Could not load about profile." });
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
      const socialLinks: Record<string, string> = {};
      if (twitter.trim()) socialLinks.twitter = twitter.trim();
      if (github.trim()) socialLinks.github = github.trim();
      if (instagram.trim()) socialLinks.instagram = instagram.trim();
      if (linkedin.trim()) socialLinks.linkedin = linkedin.trim();
      if (spotify.trim()) socialLinks.spotify = spotify.trim();
      if (youtube.trim()) socialLinks.youtube = youtube.trim();

      await axios.put("/api/admin/about", {
        title: title || null,
        biography,
        image: image || null,
        socialLinks,
        isActive,
      });

      toast({ tone: "success", title: "About profile saved successfully." });
    } catch {
      toast({ tone: "error", title: "Could not save about profile." });
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading about profile…</p>;
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="About Profile"
        description="Share your personal bio, story, photo, and social links."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Profile Title / Tag"
                placeholder="e.g. About Siddhyy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                label="Profile Picture URL"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <Textarea
              label="Biography & Journey *"
              placeholder="Tell your story, what you love building, and what drives you..."
              rows={6}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              required
            />

            <div className="border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Social Profiles & Links
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="X / Twitter URL"
                  placeholder="https://x.com/..."
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                />
                <Input
                  label="GitHub URL"
                  placeholder="https://github.com/..."
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                />
                <Input
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/..."
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                />
                <Input
                  label="Instagram URL"
                  placeholder="https://instagram.com/..."
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <Input
                  label="Spotify Profile"
                  placeholder="https://open.spotify.com/user/..."
                  value={spotify}
                  onChange={(e) => setSpotify(e.target.value)}
                />
                <Input
                  label="YouTube Channel"
                  placeholder="https://youtube.com/@..."
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                />
              </div>
            </div>

            <Toggle
              label="About Section Visible"
              description="Show this profile publicly on the About section"
              checked={isActive}
              onChange={setIsActive}
            />

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" loading={loading}>
                Save profile
              </Button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <Sparkles className="h-3.5 w-3.5 text-link" />
              <span>Live Profile Preview</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft space-y-4">
              <div className="flex items-center gap-4">
                {image ? (
                  <img
                    src={image}
                    alt="Profile preview"
                    className="h-16 w-16 rounded-full object-cover shadow-sm border border-border"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/40 text-link border border-border">
                    <User className="h-7 w-7" />
                  </div>
                )}
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {title || "About Me"}
                  </h3>
                  <p className="text-xs text-muted">Creator & Thinker</p>
                </div>
              </div>

              <div className="rounded-xl bg-white p-4 text-xs text-foreground/90 border border-border leading-relaxed whitespace-pre-wrap">
                {biography || "Your biography will be shown here..."}
              </div>

              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                {twitter ? (
                  <span className="rounded-md bg-white px-2 py-1 text-muted border border-border">
                    Twitter
                  </span>
                ) : null}
                {github ? (
                  <span className="rounded-md bg-white px-2 py-1 text-muted border border-border">
                    GitHub
                  </span>
                ) : null}
                {linkedin ? (
                  <span className="rounded-md bg-white px-2 py-1 text-muted border border-border">
                    LinkedIn
                  </span>
                ) : null}
                {spotify ? (
                  <span className="rounded-md bg-white px-2 py-1 text-muted border border-border">
                    Spotify
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
