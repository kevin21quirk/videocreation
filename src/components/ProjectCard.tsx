"use client";

import Link from "next/link";
import { formatDate, truncate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { Video, Image as ImageIcon, Trash2, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const completedVideo = project.videos.find((v) => v.status === "DONE");
  const imageAsset = project.assets.find((a) => a.fileType === "IMAGE");

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/40 hover:bg-white/8 hover:shadow-xl hover:shadow-violet-500/10">
      {/* Thumbnail / Preview */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-violet-900/40 to-indigo-900/40">
        {completedVideo?.videoUrl ? (
          <video
            src={completedVideo.videoUrl}
            className="h-full w-full object-cover"
            muted
          />
        ) : imageAsset ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageAsset.fileUrl}
            alt={project.title}
            className="h-full w-full object-cover opacity-60"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Video className="h-12 w-12 text-violet-400/40" />
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={project.status} />
        </div>

        {/* Asset count */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/60">
          {project.assets.filter((a) => a.fileType === "IMAGE").length > 0 && (
            <span className="flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" />
              {project.assets.filter((a) => a.fileType === "IMAGE").length}
            </span>
          )}
          {project.assets.filter((a) => a.fileType === "VIDEO").length > 0 && (
            <span className="flex items-center gap-1">
              <Video className="h-3.5 w-3.5" />
              {project.assets.filter((a) => a.fileType === "VIDEO").length}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-1 font-semibold text-white group-hover:text-violet-300 transition-colors">
          {project.title}
        </h3>
        <p className="mb-3 text-sm text-white/50 italic leading-relaxed">
          &ldquo;{truncate(project.quote, 80)}&rdquo;
        </p>
        <p className="mb-4 text-xs text-white/40">{formatDate(project.createdAt)}</p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/videos/${project.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Open
            </Button>
          </Link>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
