const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.100:8000";

// ---------------------------------------------------------------------------
// Typed error
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper with proper error handling
// ---------------------------------------------------------------------------

async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(
        body.detail || body.message || "Request failed",
        response.status,
        body.code
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Network error (no internet, DNS failure, timeout, etc.)
    throw new ApiError(
      "Network error — check your connection and server URL.",
      0,
      "NETWORK_ERROR"
    );
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface ImageDetectionResult {
  success: boolean;
  detections: Detection[];
  total_detections: number;
  annotated_url: string;
}

export interface VideoFrameResult {
  frame: number;
  detections: Detection[];
  count: number;
}

export interface VideoDetectionResult {
  success: boolean;
  total_frames: number;
  frames_processed: number;
  total_detections: number;
  frame_results: VideoFrameResult[];
  annotated_url: string;
}

export interface HealthResponse {
  status: string;
  model: string;
  classes: Record<string, string>;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function detectImage(
  imageUri: string,
  confidence: number = 0.25
): Promise<ImageDetectionResult> {
  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match ? match[1].toLowerCase() : "jpeg";
  const mimeType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;

  formData.append("file", {
    uri: imageUri,
    name: filename,
    type: mimeType,
  } as any);

  const result = await apiFetch<ImageDetectionResult>(
    `${DEFAULT_API_URL}/detect/image?confidence=${confidence}`,
    {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  // Make annotated_url absolute so <Image> can load it directly
  result.annotated_url = `${DEFAULT_API_URL}${result.annotated_url}`;
  return result;
}

export async function detectVideo(
  videoUri: string,
  confidence: number = 0.25,
  frameSkip: number = 3
): Promise<VideoDetectionResult> {
  const formData = new FormData();
  const filename = videoUri.split("/").pop() || "video.mp4";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match ? match[1].toLowerCase() : "mp4";
  const mimeType = ext === "mov" ? "video/quicktime" : `video/${ext}`;

  formData.append("file", {
    uri: videoUri,
    name: filename,
    type: mimeType,
  } as any);

  const result = await apiFetch<VideoDetectionResult>(
    `${DEFAULT_API_URL}/detect/video?confidence=${confidence}&frame_skip=${frameSkip}`,
    {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  result.annotated_url = `${DEFAULT_API_URL}${result.annotated_url}`;
  return result;
}

export async function checkHealth(): Promise<HealthResponse> {
  return apiFetch<HealthResponse>(`${DEFAULT_API_URL}/health`);
}
