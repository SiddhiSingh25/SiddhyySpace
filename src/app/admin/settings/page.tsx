"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Globe, Sliders, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowWallOfLove, setAllowWallOfLove] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await axios.get("/api/admin/settings");
        if (data.data) {
          const s = data.data;
          if (s.siteName !== undefined) setSiteName(String(s.siteName));
          if (s.siteDescription !== undefined)
            setSiteDescription(String(s.siteDescription));
          if (s.contactEmail !== undefined)
            setContactEmail(String(s.contactEmail));
          if (s.announcement !== undefined)
            setAnnouncement(String(s.announcement));
          if (s.showAnnouncement !== undefined)
            setShowAnnouncement(Boolean(s.showAnnouncement));
          if (s.allowComments !== undefined)
            setAllowComments(Boolean(s.allowComments));
          if (s.allowWallOfLove !== undefined)
            setAllowWallOfLove(Boolean(s.allowWallOfLove));
          if (s.maintenanceMode !== undefined)
            setMaintenanceMode(Boolean(s.maintenanceMode));
        } else {
          setSiteName("Siddhi Space");
          setSiteDescription(
            "A calm personal universe for writing, curated books, and thoughtful creations.",
          );
        }
      } catch {
        toast({ tone: "error", title: "Could not load settings." });
      } finally {
        setReady(true);
      }
    }
    void loadSettings();
  }, [toast]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/admin/settings", {
        siteName,
        siteDescription,
        contactEmail,
        announcement,
        showAnnouncement,
        allowComments,
        allowWallOfLove,
        maintenanceMode,
      });

      toast({ tone: "success", title: "Site settings updated." });
    } catch {
      toast({ tone: "error", title: "Could not save settings." });
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading settings…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <AdminHeader
        title="Settings"
        description="Global preferences, announcements, site identity, and feature switches."
      />

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Site Identity */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Globe className="h-4 w-4 text-link" />
            <h2 className="text-sm font-semibold text-foreground">
              Site Identity & Metadata
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Site Name"
              placeholder="e.g. Siddhyy Space"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <Input
              label="Contact / Inquiries Email"
              placeholder="e.g. hello@siddhyy.com"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>

          <Textarea
            label="Default Meta Description"
            placeholder="A calm corner of the web documenting code, books, and thoughts."
            rows={3}
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
          />
        </div>

        {/* Announcement Banner */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Bell className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-foreground">
              Top Announcement Banner
            </h2>
          </div>

          <Input
            label="Announcement Text"
            placeholder="e.g. ✨ New blog article published on Next.js architectures!"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />

          <Toggle
            label="Show Announcement Banner"
            description="Display this message prominently at the top of the header across all pages"
            checked={showAnnouncement}
            onChange={setShowAnnouncement}
          />
        </div>

        {/* Community & Interactive Switches */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Sliders className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-foreground">
              Community & System Features
            </h2>
          </div>

          <div className="space-y-4">
            <Toggle
              label="Enable Reader Comments"
              description="Allow authenticated readers to post comments and replies on articles"
              checked={allowComments}
              onChange={setAllowComments}
            />

            <Toggle
              label="Enable Wall of Love Notes"
              description="Allow readers to leave appreciative sticky notes on the Wall of Love"
              checked={allowWallOfLove}
              onChange={setAllowWallOfLove}
            />

            <Toggle
              label="Maintenance Mode Notice"
              description="Show a friendly maintenance alert to public visitors"
              checked={maintenanceMode}
              onChange={setMaintenanceMode}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={loading} size="lg">
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}
