"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaUploaderProps {
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  defaultPreviews?: string[];
}

export default function MediaUploader({
  maxFiles = 5,
  onFilesChange,
  className,
  defaultPreviews = [],
}: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(defaultPreviews);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
      setFiles(updatedFiles);

      // Generate local URLs for previewing images
      const newPreviews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews].slice(0, maxFiles));

      if (onFilesChange) {
        onFilesChange(updatedFiles);
      }
    },
    [files, previews, maxFiles, onFilesChange]
  );

  const removeFile = (idx: number) => {
    const updatedFiles = files.filter((_, i) => i !== idx);
    setFiles(updatedFiles);

    const updatedPreviews = previews.filter((_, i) => i !== idx);
    setPreviews(updatedPreviews);

    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "video/*": [".mp4", ".webm"],
    },
  });

  return (
    <div className={cn("flex flex-col gap-4 font-sans select-none", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[140px]",
          isDragActive
            ? "border-flownexa-lime bg-flownexa-lime-muted/20"
            : "border-white/10 hover:border-flownexa-lime/50 bg-zinc-950/20"
        )}
      >
        <input {...getInputProps()} />
        <div className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mb-3">
          <UploadCloud size={16} />
        </div>
        <p className="text-xs font-bold text-white">
          {isDragActive ? "Drop the media files here..." : "Drag & Drop media here, or Click to select"}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">
          Supports PNG, JPG, WEBP, MP4 (Max {maxFiles} files)
        </p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5 mt-2">
          {previews.map((preview, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-xl bg-white/3 border border-white/5 p-1 relative flex items-center justify-center overflow-hidden group shadow-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt=""
                className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
              />

              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="absolute top-1 right-1 size-5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-black/80 transition-colors cursor-pointer"
                title="Remove Media"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
