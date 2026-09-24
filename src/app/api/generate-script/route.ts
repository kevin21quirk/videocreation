import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateVideoScript } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const script = await generateVideoScript(project.quote, project.description);

    const updated = await db.project.update({
      where: { id: projectId },
      data: { script, status: "DRAFT" },
    });

    return NextResponse.json({ script: updated.script });
  } catch (error) {
    console.error("POST /api/generate-script error:", error);
    return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  }
}
