import Link from "next/link";
import { db } from "@/lib/db";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { Package, ExternalLink, Edit } from "lucide-react";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const products = await db.product.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { brand: { contains: q, mode: "insensitive" } },
              { category: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: { affiliate: true },
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Products"
        description="Manage recommended tools, gear, and aesthetic products."
        actionHref="/admin/products/new"
        actionLabel="New product"
      />

      <form className="mt-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products by name, brand, or category…"
          className="h-11 w-full max-w-md rounded-xl border border-border bg-white px-3 text-sm outline-none transition focus:border-link"
        />
      </form>

      {products.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="No products yet"
          description="Add favorite products, gadgets, and gear to your space."
          action={
            <ButtonLink href="/admin/products/new">Add first product</ButtonLink>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface/60 text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5">Product</th>
                  <th className="px-5 py-3.5">Brand</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => (
                  <tr key={product.id} className="transition hover:bg-surface/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-11 w-11 rounded-lg object-cover shadow-sm border border-border/50 shrink-0"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface text-muted border border-border">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-medium text-foreground hover:text-link transition no-underline block"
                          >
                            {product.name}
                          </Link>
                          {product.affiliate?.url ? (
                            <a
                              href={product.affiliate.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-muted hover:text-link mt-0.5 no-underline"
                            >
                              Store Link <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted font-medium">
                      {product.brand ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      {product.category ? (
                        <span className="rounded-lg bg-surface px-2 py-1 text-xs font-medium text-foreground border border-border">
                          {product.category}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {product.price !== null ? `₹${product.price.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {product.visible ? (
                          <Badge variant="success">Visible</Badge>
                        ) : (
                          <Badge variant="outline">Hidden</Badge>
                        )}
                        {product.featured ? (
                          <Badge variant="info">Featured</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-link hover:text-link-hover p-1.5 rounded-lg hover:bg-surface transition no-underline"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
