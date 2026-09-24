import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Video,
  Image as ImageIcon,
  Calendar,
  FileText,
  Download,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VideoPage({ params }: PageProps) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: {
      assets: true,
      videos: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  const completedVideo = project.videos.find((v) => v.status === "DONE");
  const processingVideo = project.videos.find((v) => v.status === "PROCESSING" || v.status === "PENDING");
  const imageAssets = project.assets.filter((a) => a.fileType === "IMAGE");
  const videoAssets = project.assets.filter((a) => a.fileType === "VIDEO");

  return (
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      {/* Back */}
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Title row */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="flex items-center gap-2 text-sm text-white/40">
            <Calendar className="h-3.5 w-3.5" />
            Created {formatDate(project.createdAt)}
          </p>
        </div>

        {completedVideo?.videoUrl && (
          <a href={completedVideo.videoUrl} download>
            <Button className="gap-2 shrink-0">
              <Download className="h-4 w-4" />
              Download Video
            </Button>
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video / preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video player */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="border-b border-white/10 px-5 py-3 flex items-center gap-2">
              <Video className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-white">Generated Video</span>
            </div>

            {completedVideo?.videoUrl ? (
              <video
                src={completedVideo.videoUrl}
                controls
                className="w-full aspect-video bg-black"
              />
            ) : processingVideo ? (
              <div className="flex flex-col items-center justify-center aspect-video bg-black/40 gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <p className="text-white/50 text-sm">Video is being generated...</p>
                <p className="text-white/30 text-xs">This usually takes 1–3 minutes</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center aspect-video bg-gradient-to-br from-violet-900/20 to-indigo-900/20 gap-4">
                <Video className="h-12 w-12 text-violet-400/30" />
                <p className="text-white/40 text-sm">No video generated yet</p>
                <Link href="/create">
                  <Button variant="outline" size="sm">Create Video</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Uploaded assets */}
          {imageAssets.length > 0 && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="border-b border-white/10 px-5 py-3 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-white">
                  Uploaded Images ({imageAssets.length})
                </span>
              </div>
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {imageAssets.map((asset) => (
                  <a
                    key={asset.id}
                    href={asset.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-violet-500/40 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.fileUrl}
                      alt={asset.fileName}
                      className="h-full w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {videoAssets.length > 0 && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="border-b border-white/10 px-5 py-3 flex items-center gap-2">
                <Video className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-white">
                  Uploaded Videos ({videoAssets.length})
                </span>
              </div>
              <div className="p-4 space-y-3">
                {videoAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="h-10 w-10 flex items-center justify-center rounded-md bg-violet-500/20 shrink-0">
                      <Video className="h-4 w-4 text-violet-300" />
                    </div>
                    <span className="flex-1 truncate text-sm text-white/70">
                      {asset.fileName}
                    </span>
                    <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        View
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quote */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-white">Quote</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed italic">
              &ldquo;{project.quote}&rdquo;
            </p>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-white">Description</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Script */}
          {project.script && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-white">AI Script</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap italic border-l-2 border-violet-500/30 pl-3">
                {project.script}
              </p>
            </div>
          )}

          {/* Video history */}
          {project.videos.length > 1 && (
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Video className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-white">Video History</span>
              </div>
              <div className="space-y-2">
                {project.videos.map((v) => (
                  <div key={v.id} className="flex items-center justify-between text-xs">
                    <StatusBadge status={v.status} />
                    <span className="text-white/30">{formatDate(v.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
