"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error(`Impossible de lire le fichier ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Impossible de lire le resultat."));
    reader.readAsDataURL(blob);
  });
}

async function urlToFile(url: string, filename: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Impossible de charger l'image existante.`);
  }
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
}

const modelConfig = { model: "isnet_quint8" as const, output: { format: "image/png" as const } };
const MAX_BACKGROUND_REMOVAL_DIMENSION = 1400;

let backgroundRemovalModulePromise: Promise<typeof import("@imgly/background-removal")> | null = null;
let backgroundRemovalPreloadPromise: Promise<void> | null = null;

function getBackgroundRemovalModule() {
  if (!backgroundRemovalModulePromise) {
    backgroundRemovalModulePromise = import("@imgly/background-removal");
  }

  return backgroundRemovalModulePromise;
}

async function ensureBackgroundRemovalReady() {
  if (!backgroundRemovalPreloadPromise) {
    backgroundRemovalPreloadPromise = getBackgroundRemovalModule().then(({ preload }) => preload(modelConfig));
  }

  return backgroundRemovalPreloadPromise;
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Impossible de preparer l'image."));
    image.src = url;
  });
}

async function resizeFileIfNeeded(file: File): Promise<File> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImageElement(dataUrl);
  const longestSide = Math.max(image.width, image.height);

  if (longestSide <= MAX_BACKGROUND_REMOVAL_DIMENSION) {
    return file;
  }

  const scale = MAX_BACKGROUND_REMOVAL_DIMENSION / longestSide;
  const targetWidth = Math.max(1, Math.round(image.width * scale));
  const targetHeight = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${baseName}-optimized.png`, { type: "image/png" });
}

async function removeImageBackground(file: File, onProgress?: (key: string, current: number, total: number) => void): Promise<string> {
  await ensureBackgroundRemovalReady();
  const optimizedFile = await resizeFileIfNeeded(file);
  const { removeBackground } = await getBackgroundRemovalModule();
  const blob = await removeBackground(optimizedFile, {
    ...modelConfig,
    progress: onProgress,
  });
  return blobToDataUrl(blob);
}

export type UseAdminProductImagesOptions = {
  initialImageUrls?: string[];
  defaultRemoveBackground?: boolean;
};

export function useAdminProductImages({
  initialImageUrls = [],
  defaultRemoveBackground = false,
}: UseAdminProductImagesOptions) {
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [dataUrls, setDataUrls] = useState<string[]>(initialImageUrls);
  const [processedUrls, setProcessedUrls] = useState<Record<number, string>>({});
  const [removeBackgroundMap, setRemoveBackgroundMap] = useState<Record<number, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ key: string; current: number; total: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        if (mounted) {
          await ensureBackgroundRemovalReady();
        }
      } catch {
        // Preload failure is not fatal; it will retry on demand.
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const displayedUrls = useMemo(() => {
    return dataUrls.map((url, index) => {
      if (removeBackgroundMap[index] && processedUrls[index]) {
        return processedUrls[index];
      }
      return url;
    });
  }, [dataUrls, processedUrls, removeBackgroundMap]);

  const primaryPreview = displayedUrls[0];

  const addFiles = useCallback(async (files: FileList | File[], replaceIndex?: number) => {
    const nextFiles = Array.from(files).slice(0, 5);
    if (nextFiles.length === 0) return;

    setProcessError(null);

    if (typeof replaceIndex === "number") {
      if (replaceIndex < 0 || replaceIndex > 4) return;

      const previews = await Promise.all(nextFiles.map((file) => readFileAsDataUrl(file)));
      const validEntries = nextFiles
        .map((file, index) => ({ file, preview: previews[index] }))
        .filter((entry) => Boolean(entry.preview))
        .slice(0, 5 - replaceIndex);

      if (validEntries.length === 0) return;

      setRawFiles((current) => {
        const next = [...current];
        validEntries.forEach((entry, offset) => {
          next[replaceIndex + offset] = entry.file;
        });
        return next.slice(0, 5);
      });
      setProcessedUrls((current) => {
        const next = { ...current };
        validEntries.forEach((_, offset) => {
          delete next[replaceIndex + offset];
        });
        return next;
      });
      setRemoveBackgroundMap((current) => {
        const next = { ...current };
        validEntries.forEach((_, offset) => {
          next[replaceIndex + offset] = false;
        });
        return next;
      });
      setDataUrls((current) => {
        const next = [...current];
        validEntries.forEach((entry, offset) => {
          next[replaceIndex + offset] = entry.preview;
        });
        return next.slice(0, 5);
      });
      return;
    }

    setRawFiles(nextFiles);
    setProcessedUrls({});
    setRemoveBackgroundMap({});

    const previews = await Promise.all(nextFiles.map((file) => readFileAsDataUrl(file)));
    const filtered = previews.filter(Boolean);
    setDataUrls(filtered);
  }, []);

  const processSingleImage = useCallback(async (index: number) => {
    const url = dataUrls[index];
    if (!url) return;

    setIsProcessing(true);
    setProcessError(null);
    setProgress(null);
    try {
      const file = rawFiles[index] ?? await urlToFile(url, `image-${index + 1}.png`);
      const result = await removeImageBackground(file, (key, current, total) => {
        setProgress({ key, current, total });
      });
      setProcessedUrls((prev) => ({ ...prev, [index]: result }));
    } catch (error) {
      setProcessError(error instanceof Error ? error.message : "Erreur de suppression du fond.");
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [dataUrls, rawFiles]);

  const toggleRemoveBackgroundForImage = useCallback((index: number) => {
    setRemoveBackgroundMap((current) => {
      const next = { ...current, [index]: !current[index] };
      if (next[index] && !processedUrls[index] && !isProcessing) {
        void processSingleImage(index);
      }
      return next;
    });
  }, [processedUrls, isProcessing, processSingleImage]);

  const moveImage = useCallback((index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;

    setDataUrls((current) => {
      if (index < 0 || nextIndex < 0 || index >= current.length || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });

    setRawFiles((current) => {
      if (index < 0 || nextIndex < 0 || index >= current.length || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });

    setProcessedUrls((current) => {
      const next = { ...current };
      const currentValue = current[index];
      const targetValue = current[nextIndex];

      if (targetValue === undefined) {
        delete next[index];
      } else {
        next[index] = targetValue;
      }

      if (currentValue === undefined) {
        delete next[nextIndex];
      } else {
        next[nextIndex] = currentValue;
      }

      return next;
    });

    setRemoveBackgroundMap((current) => {
      const next = { ...current };
      const currentValue = current[index];
      const targetValue = current[nextIndex];

      if (targetValue === undefined) {
        delete next[index];
      } else {
        next[index] = targetValue;
      }

      if (currentValue === undefined) {
        delete next[nextIndex];
      } else {
        next[nextIndex] = currentValue;
      }

      return next;
    });
  }, []);

  const removeImage = useCallback((index: number) => {
    setDataUrls((current) => current.filter((_, i) => i !== index));
    setRawFiles((current) => current.filter((_, i) => i !== index));
    setProcessedUrls((current) => {
      const next: Record<number, string> = {};
      Object.entries(current).forEach(([key, value]) => {
        const k = Number(key);
        if (k < index) next[k] = value;
        else if (k > index) next[k - 1] = value;
      });
      return next;
    });
    setRemoveBackgroundMap((current) => {
      const next: Record<number, boolean> = {};
      Object.entries(current).forEach(([key, value]) => {
        const k = Number(key);
        if (k < index) next[k] = value;
        else if (k > index) next[k - 1] = value;
      });
      return next;
    });
  }, []);

  const clearImages = useCallback(() => {
    setRawFiles([]);
    setDataUrls([]);
    setProcessedUrls({});
    setRemoveBackgroundMap({});
    setProcessError(null);
  }, []);

  return {
    rawFiles,
    displayedUrls,
    primaryPreview,
    removeBackgroundMap,
    isProcessing,
    processError,
    progress,
    addFiles,
    clearImages,
    toggleRemoveBackgroundForImage,
    moveImage,
    removeImage,
  };
}
