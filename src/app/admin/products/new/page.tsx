"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/features/admin/components/ImageUpload";
import { useToast } from "@/providers/ToastProvider";

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/products", {
        name,
        brand: brand || null,
        slug: slug || undefined,
        category: category || null,
        price: price ? parseFloat(price) : null,
        image: image || null,
        description: description || null,
        affiliateUrl: affiliateUrl || null,
        featured,
        visible,
      });

      toast({ tone: "success", title: "Product created successfully." });
      router.push(`/admin/products/${data.data.id}`);
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not create product." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminHeader
        title="Add new product"
        description="Recommend a piece of equipment, gadget, or everyday item."
        backHref="/admin/products"
        backLabel="Back to products"
      />

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Product name *"
            placeholder="e.g. Sony WH-1000XM5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Brand"
            placeholder="e.g. Sony, Apple, Logitech"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Slug (optional)"
            placeholder="sony-wh-1000xm5"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Input
            label="Category"
            placeholder="Audio, Desk Setup, EDC"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Input
            label="Price (₹)"
            placeholder="399.99"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <ImageUpload
          label="Product image"
          description="Upload product photo directly to Cloudinary or paste an existing link."
          value={image}
          onChange={setImage}
          folder="siddhyy/products"
        />

        <Input
          label="Affiliate / Store link"
          placeholder="https://amzn.to/..."
          value={affiliateUrl}
          onChange={(e) => setAffiliateUrl(e.target.value)}
          description="Direct purchase or referral link for visitors (optional)"
        />

        <Textarea
          label="Description / thoughts"
          placeholder="What makes this product special? How do you use it in your workflow?"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <Toggle
            label="Visible on website"
            description="Display this product in your public recommendations"
            checked={visible}
            onChange={setVisible}
          />
          <Toggle
            label="Featured item"
            description="Highlight this product at the top or on the homepage"
            checked={featured}
            onChange={setFeatured}
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create product
          </Button>
        </div>
      </form>
    </div>
  );
}
