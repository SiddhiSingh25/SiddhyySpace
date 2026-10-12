"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { Trash2 } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
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

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await axios.get(`/api/admin/products/${id}`);
        const product = data.data;
        setName(product.name);
        setBrand(product.brand ?? "");
        setSlug(product.slug);
        setCategory(product.category ?? "");
        setPrice(product.price !== null ? String(product.price) : "");
        setImage(product.image ?? "");
        setDescription(product.description ?? "");
        setAffiliateUrl(product.affiliate?.url ?? "");
        setFeatured(product.featured);
        setVisible(product.visible);
      } catch {
        toast({ tone: "error", title: "Could not load product details." });
      } finally {
        setReady(true);
      }
    }
    void loadData();
  }, [id, toast]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/admin/products/${id}`, {
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

      toast({ tone: "success", title: "Product updated successfully." });
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not update product." });
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast({ tone: "success", title: "Product deleted." });
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast({ tone: "error", title: "Could not delete product." });
      setDeleting(false);
    }
  }

  if (!ready) {
    return <p className="text-muted text-sm">Loading product details…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminHeader
        title="Edit product"
        description={`Update settings for "${name}".`}
        backHref="/admin/products"
        backLabel="Back to products"
      >
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={onDelete}
          loading={deleting}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </AdminHeader>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-soft"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Product name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Input
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Product image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Input
            label="Affiliate / Store link"
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
          />
        </div>

        <Textarea
          label="Description / thoughts"
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
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
