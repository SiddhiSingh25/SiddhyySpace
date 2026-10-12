import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

const aboutSchema = z.object({
  title: z.string().optional().nullable(),
  biography: z.string().min(1, "Biography is required"),
  image: z.string().optional().nullable(),
  socialLinks: z.record(z.string(), z.string()).optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const about = await db.about.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(successResponse(about));
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = aboutSchema.parse(await request.json());
    const existing = await db.about.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    let about;
    if (existing) {
      about = await db.about.update({
        where: { id: existing.id },
        data: {
          title: body.title?.trim() || null,
          biography: body.biography.trim(),
          image: body.image?.trim() || null,
          socialLinks: body.socialLinks || {},
          isActive: body.isActive,
        },
      });
    } else {
      about = await db.about.create({
        data: {
          title: body.title?.trim() || null,
          biography: body.biography.trim(),
          image: body.image?.trim() || null,
          socialLinks: body.socialLinks || {},
          isActive: body.isActive,
        },
      });
    }

    return NextResponse.json(
      successResponse(about, "About profile updated successfully."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update about section.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
