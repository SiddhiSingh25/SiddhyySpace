import { cloudinary } from "@/lib/cloudinary";

export async function uploadImage(filePathOrDataUri: string, folder = "siddhyy") {
  return cloudinary.uploader.upload(filePathOrDataUri, {
    folder,
    resource_type: "image",
  });
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
