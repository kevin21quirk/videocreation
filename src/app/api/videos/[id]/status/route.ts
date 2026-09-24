import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTalkStatus } from "@/lib/did";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const video = await db.generatedVideo.findUnique({ where: { id } });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // If already done/error, return current state
    if (video.status === "DONE" || video.status === "ERROR") {
      return NextResponse.json(video);
    }

    // Poll D-ID for latest status
    if (video.didTalkId) {
      const talk = await getTalkStatus(video.didTalkId);

      if (talk.status === "done" && talk.result_url) {
        const updated = await db.generatedVideo.update({
          where: { id },
          data: {
            status: "DONE",
            videoUrl: talk.result_url,
          },
        });

        // Also update project status
        await db.project.update({
          where: { id: video.projectId },
          data: { status: "COMPLETED" },
        });

        return NextResponse.json(updated);
      }

      if (talk.status === "error") {
        const updated = await db.generatedVideo.update({
          where: { id },
          data: { status: "ERROR", errorMessage: "D-ID processing failed" },
        });

        await db.project.update({
          where: { id: video.projectId },
          data: { status: "FAILED" },
        });

        return NextResponse.json(updated);
      }
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("GET /api/videos/[id]/status error:", error);
    return NextResponse.json({ error: "Failed to fetch video status" }, { status: 500 });
  }
}
