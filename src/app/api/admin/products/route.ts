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

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

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

  return NextResponse.json(successResponse(products));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = productSchema.parse(await request.json());
    let slug = body.slug?.trim() || slugify(body.name);

    const existingSlug = await db.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    let affiliateId: string | null = null;
    if (body.affiliateUrl?.trim()) {
      const affiliate = await db.affiliateLink.create({
        data: {
          url: body.affiliateUrl.trim(),
          source: "product-admin",
        },
      });
      affiliateId = affiliate.id;
    }

    const product = await db.product.create({
      data: {
        name: body.name.trim(),
        brand: body.brand?.trim() || null,
        slug,
        image: body.image?.trim() || null,
        description: body.description?.trim() || null,
        category: body.category?.trim() || null,
        price: body.price ?? null,
        featured: body.featured ?? false,
        visible: body.visible ?? true,
        affiliateId,
      },
      include: { affiliate: true },
    });

    return NextResponse.json(
      successResponse(product, "Product created successfully."),
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not create product.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
