"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Video,
  FileText,
  Upload,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  file: File;
  preview: string;
  type: "IMAGE" | "VIDEO" | "AUDIO";
}

const STEPS = [
  { id: 1, label: "Your Vision", icon: FileText },
  { id: 2, label: "Upload Assets", icon: Upload },
  { id: 3, label: "Generate", icon: Wand2 },
];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form fields
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [textOverlay, setTextOverlay] = useState("");

  // Generation state
  const [projectId, setProjectId] = useState<string | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Loading states
  const [saving, setSaving] = useState(false);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [polling, setPolling] = useState(false);

  // ----- Step 1: Create project -----
  const handleStep1 = async () => {
    if (!title.trim() || !quote.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, quote, description }),
      });

      if (!res.ok) throw new Error("Failed to create project");
      const project = await res.json();
      setProjectId(project.id);
      setStep(2);
      toast.success("Project created!");
    } catch {
      toast.error("Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  // ----- Step 2: Upload assets -----
  const handleStep2 = async () => {
    if (!projectId) return;

    if (files.length === 0) {
      // Skip upload
      setStep(3);
      return;
    }

    setUploadingFiles(true);
    try {
      for (const f of files) {
        const formData = new FormData();
        formData.append("file", f.file);
        formData.append("projectId", projectId);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          console.warn(`Failed to upload ${f.file.name}`);
        }
      }
      toast.success(`${files.length} file(s) uploaded`);
    } catch {
      toast.error("Some files failed to upload");
    } finally {
      setUploadingFiles(false);
      setStep(3);
    }
  };

  // ----- Step 3: Generate script then video -----
  const handleGenerateScript = async () => {
    if (!projectId) return;

    setGeneratingScript(true);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) throw new Error("Failed to generate script");
      const data = await res.json();
      setScript(data.script);
      toast.success("Script generated!");
    } catch {
      toast.error("Failed to generate script. Check your API key.");
    } finally {
      setGeneratingScript(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!projectId || !script) {
      toast.error("Generate a script first");
      return;
    }

    setGeneratingVideo(true);
    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate video");
      }

      const { videoId: vid } = await res.json();
      setVideoId(vid);
      toast.success("Video generation started! Polling for results...");

      // Poll for status
      setPolling(true);
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/videos/${vid}/status`);
          if (!statusRes.ok) return;
          const status = await statusRes.json();

          if (status.status === "DONE" && status.videoUrl) {
            setVideoUrl(status.videoUrl);
            clearInterval(interval);
            setPolling(false);
            setGeneratingVideo(false);
            toast.success("Your video is ready!");
          } else if (status.status === "ERROR") {
            clearInterval(interval);
            setPolling(false);
            setGeneratingVideo(false);
            toast.error("Video generation failed");
          }
        } catch {}
      }, 5000);

      // Stop polling after 5 minutes
      setTimeout(() => {
        clearInterval(interval);
        setPolling(false);
        if (!videoUrl) {
          setGeneratingVideo(false);
          toast("Video is taking longer than expected. Check back later.");
        }
      }, 300000);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to generate video";
      toast.error(message);
      setGeneratingVideo(false);
    }
  };

  const isGenerating = generatingVideo || polling;

  return (
    <div className="relative mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 -right-40 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-20 -left-40 h-[300px] w-[300px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Create AI Video</h1>
        <p className="mt-2 text-white/50">
          Bring your vision to life in three simple steps
        </p>
      </div>

      {/* Progress steps */}
      <div className="mb-10 flex items-center justify-center gap-0">
        {STEPS.map(({ id, label, icon: Icon }, i) => (
          <div key={id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  step > id
                    ? "border-violet-500 bg-violet-600 text-white"
                    : step === id
                    ? "border-violet-500 bg-violet-500/20 text-violet-300"
                    : "border-white/20 bg-white/5 text-white/30"
                )}
              >
                {step > id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  step === id ? "text-violet-300" : "text-white/30"
                )}
              >
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-3 mb-5 h-px w-16 sm:w-24 transition-all duration-300",
                  step > id ? "bg-violet-500" : "bg-white/10"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* ---- STEP 1 ---- */}
      {step === 1 && (
        <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Your Vision</h2>
            <p className="text-sm text-white/50">Tell us what story you want to tell</p>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Motivational Monday Message"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          {/* Quote */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Your Quote or Key Message
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. &quot;The best time to plant a tree was 20 years ago. The second best time is now.&quot;"
              rows={3}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Video Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the tone, audience, and purpose... e.g. An uplifting motivational video for young entrepreneurs, energetic and inspiring tone, 60 seconds long."
              rows={4}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
            />
          </div>

          {/* Text overlay */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Text Overlays <span className="text-white/30">(optional)</span>
            </label>
            <input
              type="text"
              value={textOverlay}
              onChange={(e) => setTextOverlay(e.target.value)}
              placeholder="e.g. Subscribe for more • www.yoursite.com"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          <Button
            onClick={handleStep1}
            disabled={saving || !title || !quote || !description}
            className="w-full gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Continue to Upload"}
          </Button>
        </div>
      )}

      {/* ---- STEP 2 ---- */}
      {step === 2 && (
        <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Upload Assets</h2>
            <p className="text-sm text-white/50">
              Add images, videos, or audio to personalise your AI video. You can
              also skip this step.
            </p>
          </div>

          <FileUploader onUpload={setFiles} maxFiles={10} />

          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleStep2}
              disabled={uploadingFiles}
              className="flex-1 gap-2"
            >
              {uploadingFiles ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {uploadingFiles
                ? "Uploading..."
                : files.length > 0
                ? `Upload ${files.length} file(s) & Continue`
                : "Skip & Continue"}
            </Button>
          </div>
        </div>
      )}

      {/* ---- STEP 3 ---- */}
      {step === 3 && (
        <div className="glass rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">
              Generate Your Video
            </h2>
            <p className="text-sm text-white/50">
              First generate an AI script, then create your avatar video
            </p>
          </div>

          {/* Script section */}
          <div className="rounded-xl border border-white/10 bg-black/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-white">AI Script</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateScript}
                disabled={generatingScript || isGenerating}
                className="gap-1.5"
              >
                {generatingScript ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {script ? "Regenerate" : "Generate Script"}
              </Button>
            </div>

            {script ? (
              <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap italic border-l-2 border-violet-500/40 pl-4">
                {script}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm text-white/30">
                <div className="h-px flex-1 bg-white/10" />
                <span>Script will appear here</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            )}
          </div>

          {/* Video section */}
          {videoUrl ? (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-emerald-500/30 bg-black">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-80 object-contain"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 gap-2"
                >
                  <Video className="h-4 w-4" />
                  View in Dashboard
                </Button>
                <a href={videoUrl} download className="flex-1">
                  <Button className="w-full gap-2">
                    Download Video
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleGenerateVideo}
              disabled={!script || isGenerating}
              className="w-full gap-2"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {polling ? "Processing video..." : "Starting generation..."}
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  Generate Avatar Video
                </>
              )}
            </Button>
          )}

          {isGenerating && (
            <p className="text-center text-xs text-white/30">
              AI avatar generation takes 1–3 minutes. Please wait...
            </p>
          )}

          {!videoUrl && (
            <Button
              variant="ghost"
              onClick={() => setStep(2)}
              disabled={isGenerating}
              className="w-full gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
