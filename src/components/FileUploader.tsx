"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn, formatFileSize } from "@/lib/utils";
import { Upload, X, Image as ImageIcon, Video, FileAudio } from "lucide-react";

interface UploadedFile {
  file: File;
  preview: string;
  type: "IMAGE" | "VIDEO" | "AUDIO";
}

interface FileUploaderProps {
  projectId?: string;
  onUpload?: (files: UploadedFile[]) => void;
  accept?: string[];
  maxFiles?: number;
  className?: string;
}

const fileIcon = (type: string) => {
  if (type === "IMAGE") return <ImageIcon className="h-5 w-5" />;
  if (type === "VIDEO") return <Video className="h-5 w-5" />;
  return <FileAudio className="h-5 w-5" />;
};

const getFileType = (file: File): "IMAGE" | "VIDEO" | "AUDIO" => {
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.type.startsWith("video/")) return "VIDEO";
  return "AUDIO";
};

export default function FileUploader({
  onUpload,
  maxFiles = 10,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newFiles = accepted.slice(0, maxFiles - files.length).map((f) => ({
        file: f,
        preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : "",
        type: getFileType(f),
      }));

      const updated = [...files, ...newFiles].slice(0, maxFiles);
      setFiles(updated);
      onUpload?.(updated);
    },
    [files, maxFiles, onUpload]
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onUpload?.(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
      "audio/*": [".mp3", ".wav", ".ogg"],
    },
    maxFiles,
  });

  return (
    <div className={cn("space-y-3", className)}>
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
          isDragActive
            ? "border-violet-400 bg-violet-500/10"
            : "border-white/20 bg-white/5 hover:border-violet-500/50 hover:bg-white/8"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              isDragActive
                ? "bg-violet-500/30 text-violet-300"
                : "bg-white/10 text-white/40"
            )}
          >
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">
              {isDragActive ? "Drop files here" : "Drag & drop or click to upload"}
            </p>
            <p className="mt-1 text-xs text-white/40">
              Images, videos, and audio files supported
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
            >
              {/* Preview or icon */}
              {f.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.preview}
                  alt={f.file.name}
                  className="h-10 w-10 rounded-md object-cover shrink-0"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-violet-300 shrink-0">
                  {fileIcon(f.type)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white/80">
                  {f.file.name}
                </p>
                <p className="text-xs text-white/40">{formatFileSize(f.file.size)}</p>
              </div>

              <button
                type="button"
                onClick={() => removeFile(i)}
                className="shrink-0 rounded-md p-1 text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
