import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-zinc-700/60 text-zinc-300 border-zinc-600",
  PROCESSING: "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse",
  COMPLETED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  FAILED: "bg-red-500/20 text-red-300 border-red-500/40",
  PENDING: "bg-zinc-700/60 text-zinc-300 border-zinc-600",
  DONE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  ERROR: "bg-red-500/20 text-red-300 border-red-500/40",
};

interface BadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] ?? "bg-zinc-700/60 text-zinc-300 border-zinc-600",
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-zinc-400": status === "DRAFT" || status === "PENDING",
          "bg-amber-400 animate-pulse": status === "PROCESSING",
          "bg-emerald-400": status === "COMPLETED" || status === "DONE",
          "bg-red-400": status === "FAILED" || status === "ERROR",
        })}
      />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
