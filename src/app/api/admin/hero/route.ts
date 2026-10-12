import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

const heroSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  subheading: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaHref: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  background: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const hero = await db.hero.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(successResponse(hero));
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = heroSchema.parse(await request.json());
    const existing = await db.hero.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    let hero;
    if (existing) {
      hero = await db.hero.update({
        where: { id: existing.id },
        data: {
          headline: body.headline.trim(),
          subheading: body.subheading?.trim() || null,
          ctaLabel: body.ctaLabel?.trim() || null,
          ctaHref: body.ctaHref?.trim() || null,
          image: body.image?.trim() || null,
          background: body.background?.trim() || null,
          isActive: body.isActive,
        },
      });
    } else {
      hero = await db.hero.create({
        data: {
          headline: body.headline.trim(),
          subheading: body.subheading?.trim() || null,
          ctaLabel: body.ctaLabel?.trim() || null,
          ctaHref: body.ctaHref?.trim() || null,
          image: body.image?.trim() || null,
          background: body.background?.trim() || null,
          isActive: body.isActive,
        },
      });
    }

    return NextResponse.json(
      successResponse(hero, "Hero section updated successfully."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update hero section.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
