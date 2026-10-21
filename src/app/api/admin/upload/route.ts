import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guards";
import { errorResponse, successResponse } from "@/lib/api-response";
import { uploadMedia } from "@/services/cloudinary.service";
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

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        errorResponse("Uploaded file must be an image (PNG, JPG, WebP) or video (MP4, WebM, MOV)."),
        { status: 400 },
      );
    }

    const maxSizeBytes = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024; // 50MB for video, 10MB for image
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        errorResponse(`File size exceeds the ${isVideo ? "50MB" : "10MB"} limit.`),
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || (isVideo ? "video/mp4" : "image/jpeg");
    const base64DataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const uploadResult = await uploadMedia(
      base64DataUri,
      folder,
      isVideo ? "video" : "image",
    );

    // Record the uploaded asset in the Media table
    try {
      await db.media.create({
        data: {
          name: file.name,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          type: isVideo ? "VIDEO" : "IMAGE",
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
          mediaType: isVideo ? "video" : "image",
        },
        `${isVideo ? "Video" : "Image"} uploaded successfully.`,
      ),
      { status: 201 },
    );
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    return NextResponse.json(
      errorResponse("Failed to upload media to Cloudinary.", [
        err instanceof Error ? err.message : "Unknown error",
      ]),
      { status: 500 },
    );
  }
}

