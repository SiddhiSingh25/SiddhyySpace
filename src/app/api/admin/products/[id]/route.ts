import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { slugify } from "@/utils/content";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().optional().nullable(),
  slug: z.string().optional(),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  price: z.number().min(0).optional().nullable(),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  affiliateUrl: z.string().optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const product = await db.product.findFirst({
    where: { id, deletedAt: null },
    include: { affiliate: true },
  });

  if (!product) {
    return NextResponse.json(errorResponse("Product not found."), {
      status: 404,
    });
  }

  return NextResponse.json(successResponse(product));
}

export async function PUT(request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  try {
    const body = productSchema.parse(await request.json());
    const existing = await db.product.findFirst({
      where: { id, deletedAt: null },
      include: { affiliate: true },
    });

    if (!existing) {
      return NextResponse.json(errorResponse("Product not found."), {
        status: 404,
      });
    }

    const slug = body.slug?.trim() || slugify(body.name);

    let affiliateId = existing.affiliateId;
    if (body.affiliateUrl !== undefined) {
      if (body.affiliateUrl?.trim()) {
        if (existing.affiliateId) {
          await db.affiliateLink.update({
            where: { id: existing.affiliateId },
            data: { url: body.affiliateUrl.trim() },
          });
        } else {
          const affiliate = await db.affiliateLink.create({
            data: {
              url: body.affiliateUrl.trim(),
              source: "product-admin",
            },
          });
          affiliateId = affiliate.id;
        }
      } else {
        affiliateId = null;
      }
    }

    const product = await db.product.update({
      where: { id },
      data: {
        name: body.name.trim(),
        brand: body.brand?.trim() || null,
        slug,
        image: body.image?.trim() || null,
        description: body.description?.trim() || null,
        category: body.category?.trim() || null,
        price: body.price ?? null,
        featured: body.featured,
        visible: body.visible,
        affiliateId,
      },
      include: { affiliate: true },
    });

    return NextResponse.json(
      successResponse(product, "Product updated successfully."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update product.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  await db.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(
    successResponse(null, "Product deleted successfully."),
  );
}
