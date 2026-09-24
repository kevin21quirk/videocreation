import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createTalk } from "@/lib/did";

export async function POST(request: NextRequest) {
  try {
    const { projectId, avatarUrl } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { assets: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!project.script) {
      return NextResponse.json(
        { error: "Generate a script first before creating a video" },
        { status: 400 }
      );
    }

    // Update project status
    await db.project.update({
      where: { id: projectId },
      data: { status: "PROCESSING" },
    });

    // Find an uploaded image asset to use as avatar source if no explicit URL given
    const imageAsset = project.assets.find((a) => a.fileType === "IMAGE");
    const sourceUrl = avatarUrl || imageAsset?.fileUrl;

    // Create D-ID talk
    const talk = await createTalk({
      script: project.script,
      sourceUrl,
    });

    // Create generated video record
    const video = await db.generatedVideo.create({
      data: {
        projectId,
        didTalkId: talk.id,
        status: "PROCESSING",
      },
    });

    return NextResponse.json({ videoId: video.id, talkId: talk.id });
  } catch (error) {
    console.error("POST /api/generate-video error:", error);

    // Reset project status on failure
    try {
      const { projectId } = await request.json().catch(() => ({}));
      if (projectId) {
        await db.project.update({
          where: { id: projectId },
          data: { status: "FAILED" },
        });
      }
    } catch {}

    return NextResponse.json({ error: "Failed to generate video" }, { status: 500 });
  }
}
