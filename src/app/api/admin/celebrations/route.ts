import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

const celebrationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  date: z.string().or(z.date()),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const celebrations = await db.celebration.findMany({
    where: {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ order: "asc" }, { date: "desc" }],
  });

  return NextResponse.json(successResponse(celebrations));
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = celebrationSchema.parse(await request.json());
    const dateObj = new Date(body.date);

    const celebration = await db.celebration.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        image: body.image?.trim() || null,
        date: dateObj,
        order: body.order ?? 0,
        visible: body.visible ?? true,
      },
    });

    return NextResponse.json(
      successResponse(celebration, "Celebration milestone created."),
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not create celebration.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
