export type ProjectStatus = "DRAFT" | "PROCESSING" | "COMPLETED" | "FAILED";
export type VideoStatus = "PENDING" | "PROCESSING" | "DONE" | "ERROR";
export type AssetType = "IMAGE" | "VIDEO" | "AUDIO";

export interface Asset {
  id: string;
  projectId: string;
  fileName: string;
  fileUrl: string;
  fileType: AssetType;
  fileSize: number;
  createdAt: string;
}

export interface GeneratedVideo {
  id: string;
  projectId: string;
  didTalkId: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  status: VideoStatus;
  errorMessage: string | null;
  duration: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  quote: string;
  description: string;
  script: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  assets: Asset[];
  videos: GeneratedVideo[];
}
