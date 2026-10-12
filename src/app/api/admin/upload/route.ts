import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { uploadImage } from "@/services/cloudinary.service";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string)?.trim() || "siddhyy";

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        errorResponse("No file uploaded or invalid file format."),
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        errorResponse("Uploaded file must be an image (JPEG, PNG, WebP, etc.)."),
        { status: 400 },
      );
    }

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        errorResponse("Image file size exceeds the 10MB limit."),
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "image/jpeg";
    const base64DataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const uploadResult = await uploadImage(base64DataUri, folder);

    // Record the uploaded asset in the Media table
    try {
      await db.media.create({
        data: {
          name: file.name,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          type: "IMAGE",
          width: uploadResult.width ?? null,
          height: uploadResult.height ?? null,
          size: uploadResult.bytes ?? file.size,
          mimeType: file.type,
        },
      });
    } catch (dbErr) {
      console.warn("Could not record media in db:", dbErr);
    }

    return NextResponse.json(
      successResponse(
        {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
        },
        "Image uploaded to Cloudinary successfully.",
      ),
      { status: 201 },
    );
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json(
      errorResponse("Failed to upload image to Cloudinary.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 500 },
    );
  }
}
