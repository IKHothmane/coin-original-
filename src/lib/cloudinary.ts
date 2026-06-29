const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudinaryFolder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? "coin-original";

type CloudinaryUploadResponse = {
  secure_url?: string;
};

export function isCloudinaryConfigured() {
  return Boolean(cloudinaryCloudName && cloudinaryUploadPreset);
}

export function getCloudinaryConfigErrorMessage() {
  return "Cloudinary n'est pas configure. Ajoute NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.";
}

export async function uploadImagesToCloudinary(files: File[], targetFolder?: string) {
  if (!isCloudinaryConfigured()) {
    return {
      data: null,
      error: getCloudinaryConfigErrorMessage(),
    };
  }

  try {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", cloudinaryUploadPreset!);
      formData.append("folder", targetFolder ? `${cloudinaryFolder}/${targetFolder}` : cloudinaryFolder);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        return {
          data: null,
          error: "Impossible d'envoyer l'image vers Cloudinary.",
        };
      }

      const payload = (await response.json()) as CloudinaryUploadResponse;

      if (!payload.secure_url) {
        return {
          data: null,
          error: "Cloudinary n'a retourne aucune URL d'image.",
        };
      }

      uploadedUrls.push(payload.secure_url);
    }

    return {
      data: uploadedUrls,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: "Erreur reseau pendant l'envoi des images vers Cloudinary.",
    };
  }
}
