import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Video,
  Zap,
  Upload,
  MessageSquare,
  PlayCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Write Your Vision",
    description:
      "Describe your video in plain English — a quote, a mood, a message. Our AI handles the rest.",
  },
  {
    icon: Upload,
    title: "Upload Your Assets",
    description:
      "Drag & drop images, videos, or audio to give your AI avatar the visual context it needs.",
  },
  {
    icon: Zap,
    title: "AI Script Generation",
    description:
      "Claude AI crafts a compelling, natural-sounding script tailored to your vision in seconds.",
  },
  {
    icon: PlayCircle,
    title: "Generate Your Video",
    description:
      "D-ID's lifelike avatar technology brings your script to life with stunning realism.",
  },
];

const stats = [
  { value: "10s", label: "Script generation" },
  { value: "HD", label: "Video quality" },
  { value: "∞", label: "Creative possibilities" },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-float absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/15 blur-3xl" />
        <div
          className="animate-float absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-3xl"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-violet-900/10 blur-3xl"
        />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-36 text-center">
        {/* Pill badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Claude AI &amp; D-ID
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
          Turn any idea into a{" "}
          <span className="text-gradient">stunning AI video</span>{" "}
          in minutes
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-white/60 leading-relaxed">
          Write a quote, describe your vision, upload your assets — and watch as
          AI brings your story to life with a photorealistic talking avatar.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/create">
            <Button size="lg" className="gap-2 px-8 glow-violet">
              <Sparkles className="h-5 w-5" />
              Create Your First Video
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" size="lg" className="gap-2 px-8">
              <Video className="h-5 w-5" />
              View Dashboard
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-12">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-gradient">{value}</div>
              <div className="mt-1 text-sm text-white/40">{label}</div>
            </div>
          ))}
        </div>

        {/* Demo preview card */}
        <div className="relative mx-auto mt-20 max-w-3xl">
          <div className="glass rounded-3xl p-1 shadow-2xl shadow-violet-900/30">
            <div className="rounded-[22px] bg-gradient-to-br from-violet-900/40 via-indigo-900/30 to-black/60 p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Avatar placeholder */}
                <div className="shrink-0 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
                  <Video className="h-9 w-9 text-white" />
                </div>
                <div className="text-left flex-1">
                  <div className="mb-2 text-xs font-medium text-violet-400 uppercase tracking-wider">
                    AI Generated Script
                  </div>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed italic">
                    &ldquo;Innovation is not about having the best ideas — it&apos;s about
                    making ideas happen. Today, I want to share how you can transform
                    your vision into reality, one step at a time...&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Avatar video generated · 45 seconds
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-20 w-3/4 bg-violet-600/20 blur-2xl rounded-full" />
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything you need to create
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            A complete pipeline from idea to published video
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10 group"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 text-violet-300 group-hover:from-violet-600/50 group-hover:to-indigo-600/50 transition-all">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mb-1 text-xs text-violet-400/60 font-mono">
                0{i + 1}
              </div>
              <h3 className="mb-2 font-semibold text-white">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="relative mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <div className="glass rounded-3xl p-10 sm:p-16">
          <div className="mb-4 flex justify-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to create?
          </h2>
          <p className="text-white/50 mb-8 text-lg">
            Your first AI video is just a few clicks away.
          </p>
          <Link href="/create">
            <Button size="lg" className="gap-2 px-10 glow-violet">
              <Sparkles className="h-5 w-5" />
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
