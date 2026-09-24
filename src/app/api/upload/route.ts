import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const projectId = formData.get("projectId") as string;

    if (!file || !projectId) {
      return NextResponse.json(
        { error: "file and projectId are required" },
        { status: 400 }
      );
    }

    const mimeType = file.type;
    let fileType: "IMAGE" | "VIDEO" | "AUDIO" = "IMAGE";
    if (mimeType.startsWith("video/")) fileType = "VIDEO";
    else if (mimeType.startsWith("audio/")) fileType = "AUDIO";

    // Upload to Vercel Blob
    const blob = await put(`projects/${projectId}/${file.name}`, file, {
      access: "public",
    });

    // Save asset record
    const asset = await db.asset.create({
      data: {
        projectId,
        fileName: file.name,
        fileUrl: blob.url,
        fileType,
        fileSize: file.size,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
