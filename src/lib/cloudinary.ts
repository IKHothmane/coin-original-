const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudinaryFolder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER ?? "coin-original";
const cloudinaryUploadPathSegment = "/image/upload/";

type CloudinaryUploadResponse = {
  secure_url?: string;
};

export function isCloudinaryConfigured() {
  return Boolean(cloudinaryCloudName && cloudinaryUploadPreset);
}

export function getCloudinaryConfigErrorMessage() {
  return "Cloudinary n'est pas configure. Ajoute NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.";
}

export function getCloudinaryBackgroundRemovedUrl(url: string) {
  if (
    !url.includes("res.cloudinary.com") ||
    !url.includes(cloudinaryUploadPathSegment) ||
    url.includes("/e_background_removal/")
  ) {
    return url;
  }

  const [baseUrl, queryString] = url.split("?");
  const [prefix, suffix] = baseUrl.split(cloudinaryUploadPathSegment);

  if (!prefix || !suffix) {
    return url;
  }

  const transformedUrl = `${prefix}${cloudinaryUploadPathSegment}e_background_removal/f_png/${suffix}`;
  return queryString ? `${transformedUrl}?${queryString}` : transformedUrl;
}

export function getCloudinaryOriginalUrl(url: string) {
  if (!url.includes("res.cloudinary.com") || !url.includes(cloudinaryUploadPathSegment)) {
    return url;
  }

  const [baseUrl, queryString] = url.split("?");
  const [prefix, suffix] = baseUrl.split(cloudinaryUploadPathSegment);

  if (!prefix || !suffix) {
    return url;
  }

  const originalSuffix = suffix.replace(/^e_background_removal\/f_png\//, "");
  const originalUrl = `${prefix}${cloudinaryUploadPathSegment}${originalSuffix}`;
  return queryString ? `${originalUrl}?${queryString}` : originalUrl;
}

export async function uploadImagesToCloudinary(files: Array<File | Blob>, targetFolder?: string) {
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

function isDataUrl(url: string) {
  return url.startsWith("data:");
}

async function dataUrlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Impossible de lire l'image locale.");
  }
  return response.blob();
}

export async function uploadProductImageUrlsToCloudinary(
  productSlug: string,
  urls: string[],
): Promise<{ urls: string[]; error: string | null }> {
  if (!isCloudinaryConfigured()) {
    return { urls: [], error: getCloudinaryConfigErrorMessage() };
  }

  try {
    const blobs: Blob[] = [];
    const remoteUrls: string[] = [];

    for (const url of urls) {
      if (isDataUrl(url)) {
        blobs.push(await dataUrlToBlob(url));
      } else {
        remoteUrls.push(url);
      }
    }

    if (blobs.length > 0) {
      const uploadResult = await uploadImagesToCloudinary(blobs, productSlug);
      if (uploadResult.error || !uploadResult.data) {
        return { urls: [], error: uploadResult.error ?? "Echec de l'upload Cloudinary." };
      }
      return { urls: [...uploadResult.data, ...remoteUrls], error: null };
    }

    return { urls: remoteUrls, error: null };
  } catch (error) {
    return {
      urls: [],
      error: error instanceof Error ? error.message : "Erreur d'envoi des images vers Cloudinary.",
    };
  }
}
