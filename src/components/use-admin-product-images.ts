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
  const [processedUrls, setProcessedUrls] = useState<string[]>([]);
  const [removeBackground, setRemoveBackground] = useState(defaultRemoveBackground);
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
    if (removeBackground && processedUrls.length > 0) {
      return processedUrls;
    }
    return dataUrls;
  }, [dataUrls, processedUrls, removeBackground]);

  const primaryPreview = displayedUrls[0];

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const nextFiles = Array.from(files).slice(0, 5);
    if (nextFiles.length === 0) return;

    setRawFiles(nextFiles);
    setProcessedUrls([]);
    setProcessError(null);

    const previews = await Promise.all(nextFiles.map((file) => readFileAsDataUrl(file)));
    const filtered = previews.filter(Boolean);
    setDataUrls(filtered);
  }, []);

  const processImages = useCallback(async () => {
    const filesToProcess =
      rawFiles.length > 0
        ? rawFiles
        : await Promise.all(
            dataUrls.map((url, index) => urlToFile(url, `image-${index + 1}.png`)),
          );

    if (filesToProcess.length === 0) return;

    setIsProcessing(true);
    setProcessError(null);
    setProgress(null);
    try {
      const results = await Promise.all(
        filesToProcess.map((file) =>
          removeImageBackground(file, (key, current, total) => {
            setProgress({ key, current, total });
          }),
        ),
      );
      setProcessedUrls(results);
    } catch (error) {
      setProcessError(error instanceof Error ? error.message : "Erreur de suppression du fond.");
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }, [rawFiles, dataUrls]);

  const toggleRemoveBackground = useCallback(() => {
    setRemoveBackground((current) => {
      const next = !current;
      if (next && processedUrls.length === 0 && !isProcessing) {
        void processImages();
      }
      return next;
    });
  }, [processedUrls.length, isProcessing, processImages]);

  const clearImages = useCallback(() => {
    setRawFiles([]);
    setDataUrls([]);
    setProcessedUrls([]);
    setProcessError(null);
  }, []);

  return {
    rawFiles,
    displayedUrls,
    primaryPreview,
    removeBackground,
    isProcessing,
    processError,
    progress,
    addFiles,
    clearImages,
    toggleRemoveBackground,
  };
}
