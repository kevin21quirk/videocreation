"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Project } from "@/types";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Video,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProjects(data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === "COMPLETED").length,
    processing: projects.filter(
      (p) => p.status === "PROCESSING" || p.status === "DRAFT"
    ).length,
    failed: projects.filter((p) => p.status === "FAILED").length,
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-white/50">Manage and track your AI video projects</p>
        </div>
        <Link href="/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Video
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {!loading && projects.length > 0 && (
        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: Video,
              label: "Total Projects",
              value: stats.total,
              color: "text-violet-300",
              bg: "bg-violet-500/10 border-violet-500/20",
            },
            {
              icon: CheckCircle,
              label: "Completed",
              value: stats.completed,
              color: "text-emerald-300",
              bg: "bg-emerald-500/10 border-emerald-500/20",
            },
            {
              icon: Clock,
              label: "In Progress",
              value: stats.processing,
              color: "text-amber-300",
              bg: "bg-amber-500/10 border-amber-500/20",
            },
            {
              icon: AlertCircle,
              label: "Failed",
              value: stats.failed,
              color: "text-red-300",
              bg: "bg-red-500/10 border-red-500/20",
            },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className={`glass rounded-xl border p-4 ${bg}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/50">{label}</p>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-8 w-8 text-violet-400 animate-spin" />
          <p className="text-white/50">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20">
            <Video className="h-9 w-9 text-violet-400/60" />
          </div>
          <h2 className="text-xl font-semibold text-white">No projects yet</h2>
          <p className="mt-2 text-white/50 max-w-sm">
            Create your first AI video project to get started.
          </p>
          <Link href="/create" className="mt-6">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create First Video
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
