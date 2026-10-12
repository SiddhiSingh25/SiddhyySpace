import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";

const settingsSchema = z.record(z.string(), z.any());

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const records = await db.setting.findMany();
  const settingsMap: Record<string, unknown> = {};
  for (const r of records) {
    settingsMap[r.key] = r.value;
  }

  return NextResponse.json(successResponse(settingsMap));
}

export async function PUT(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = settingsSchema.parse(await request.json());

    const upsertPromises = Object.entries(body).map(([key, value]) =>
      db.setting.upsert({
        where: { key },
        update: { value: value as object },
        create: { key, value: value as object },
      }),
    );

    await Promise.all(upsertPromises);

    return NextResponse.json(
      successResponse(body, "Settings updated successfully."),
    );
  } catch (err) {
    return NextResponse.json(
      errorResponse("Could not update settings.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 400 },
    );
  }
}
