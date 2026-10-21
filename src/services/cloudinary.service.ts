import { cloudinary } from "@/lib/cloudinary";

export async function uploadMedia(
  filePathOrDataUri: string,
  folder = "siddhyy",
  resourceType: "image" | "video" | "auto" = "auto",
) {
  return cloudinary.uploader.upload(filePathOrDataUri, {
    folder,
    resource_type: resourceType,
  });
}

export async function uploadImage(filePathOrDataUri: string, folder = "siddhyy") {
  return uploadMedia(filePathOrDataUri, folder, "image");
}

export async function uploadVideo(filePathOrDataUri: string, folder = "siddhyy") {
  return uploadMedia(filePathOrDataUri, folder, "video");
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

export async function deleteVideo(publicId: string) {
  return cloudinary.uploader.destroy(publicId, { resource_type: "video" });
}
