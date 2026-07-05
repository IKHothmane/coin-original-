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

async function removeImageBackground(file: File, onProgress?: (key: string, current: number, total: number) => void): Promise<string> {
  const { removeBackground } = await import("@imgly/background-removal");
  const blob = await removeBackground(file, {
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
        const { preload } = await import("@imgly/background-removal");
        if (mounted) {
          await preload(modelConfig);
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

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const nextFiles = Array.from(files).slice(0, 5);
    if (nextFiles.length === 0) return;

    setRawFiles(nextFiles);
    setProcessedUrls({});
    setRemoveBackgroundMap({});
    setProcessError(null);

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
    removeImage,
  };
}
