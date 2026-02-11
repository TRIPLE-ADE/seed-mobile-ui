import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  detectImage,
  detectVideo,
  checkHealth,
  type ImageDetectionResult,
  type VideoDetectionResult,
  type HealthResponse,
  type ApiError,
} from "./detection";

// ---------------------------------------------------------------------------
// Health check — polled query
// ---------------------------------------------------------------------------

export function useHealthCheck(enabled = true) {
  return useQuery<HealthResponse, ApiError>({
    queryKey: ["health"],
    queryFn: checkHealth,
    enabled,
    staleTime: 1000 * 30, // 30 seconds
    retry: 1,
    refetchOnWindowFocus: true,
  });
}

// ---------------------------------------------------------------------------
// Image detection — mutation (fire once per upload)
// ---------------------------------------------------------------------------

interface DetectImageVars {
  imageUri: string;
  confidence?: number;
}

export function useDetectImage() {
  const queryClient = useQueryClient();

  return useMutation<ImageDetectionResult, ApiError, DetectImageVars>({
    mutationFn: ({ imageUri, confidence }) =>
      detectImage(imageUri, confidence),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health"] });
    },
  });
}

// ---------------------------------------------------------------------------
// Video detection — mutation
// ---------------------------------------------------------------------------

interface DetectVideoVars {
  videoUri: string;
  confidence?: number;
  frameSkip?: number;
}

export function useDetectVideo() {
  const queryClient = useQueryClient();

  return useMutation<VideoDetectionResult, ApiError, DetectVideoVars>({
    mutationFn: ({ videoUri, confidence, frameSkip }) =>
      detectVideo(videoUri, confidence, frameSkip),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health"] });
    },
  });
}
