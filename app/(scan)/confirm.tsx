import { Alert, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { View, Text, ScrollView, Pressable } from "../../tw";
import { Image } from "../../tw/image";
import { Icon } from "../../components/icon";
import { useDetectImage, useDetectVideo } from "../../api/hooks";
import { ApiError } from "../../api/detection";
import { getSettings } from "../../stores/scan-store";

export default function ConfirmScreen() {
  const { uri, type } = useLocalSearchParams<{
    uri: string;
    type: "image" | "video";
  }>();

  const imageMutation = useDetectImage();
  const videoMutation = useDetectVideo();

  const isPending = imageMutation.isPending || videoMutation.isPending;

  const handleAnalyze = async () => {
    if (!uri) return;
    if (process.env.EXPO_OS === "ios")
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

    const settings = await getSettings();
    const conf = settings.confidence || 0.5;

    if (type === "video") {
      videoMutation.mutate(
        { videoUri: uri, confidence: conf, frameSkip: 3 },
        {
          onSuccess: (result) => {
            router.replace({
              pathname: "/(scan)/results",
              params: {
                detections: JSON.stringify(
                  result.frame_results.flatMap((f) => f.detections)
                ),
                totalDetections: result.total_detections.toString(),
                annotatedUrl: result.annotated_url,
                sourceUri: uri,
                mediaType: "video",
                totalFrames: result.total_frames.toString(),
                framesProcessed: result.frames_processed.toString(),
              },
            });
          },
          onError: (error) => {
            Alert.alert(
              "Analysis Failed",
              error instanceof ApiError
                ? error.code === "NETWORK_ERROR"
                  ? "Could not connect to the server. Check your network and server URL in Settings."
                  : error.message
                : "An unexpected error occurred."
            );
          },
        }
      );
    } else {
      imageMutation.mutate(
        { imageUri: uri, confidence: conf },
        {
          onSuccess: (result) => {
            router.replace({
              pathname: "/(scan)/results",
              params: {
                detections: JSON.stringify(result.detections),
                totalDetections: result.total_detections.toString(),
                annotatedUrl: result.annotated_url,
                sourceUri: uri,
                mediaType: "image",
              },
            });
          },
          onError: (error) => {
            Alert.alert(
              "Analysis Failed",
              error instanceof ApiError
                ? error.code === "NETWORK_ERROR"
                  ? "Could not connect to the server. Check your network and server URL in Settings."
                  : error.message
                : "An unexpected error occurred."
            );
          },
        }
      );
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-sf-bg"
      contentContainerClassName="p-4 gap-4 pb-24"
    >
      {/* Preview */}
      <View className="rounded-2xl overflow-hidden bg-sf-bg-2 border border-card-border aspect-square">
        {type === "video" ? (
          <View className="flex-1 items-center justify-center gap-2">
            <View className="items-center justify-center rounded-full w-16 h-16 bg-black/06"
            >
              <Icon name="videocam" size={32} color="#8A8A8E" />
            </View>
            <Text className="text-base font-medium text-sf-text-2">
              Video selected
            </Text>
          </View>
        ) : (
          <Image className="flex-1 border border-card-border rounded-2xl" source={{ uri }} contentFit="contain" />
        )}
      </View>

      {/* Info Banner */}
      <View className="rounded-2xl bg-sf-bg-3 p-4 flex-row items-center gap-3 border border-card-border">
        <View className="items-center justify-center rounded-full w-12 h-12 bg-blue-500/8">
          <Icon name="information-circle" size={20} color="#007AFF" />
        </View>
        <Text className="flex-1 text-sm text-sf-text-2">
          {type === "video"
            ? "Video will be analyzed frame by frame. This may take a moment."
            : "Image will be sent to the server for AI-powered damage detection."}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="gap-3 pt-2">
        {/* Analyze */}
        <Pressable
          className="rounded-2xl bg-primary p-4 flex-row items-center justify-center gap-3 active:opacity-80 shadow-sm"
          onPress={handleAnalyze}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <ActivityIndicator color="white" size="small" />
              <Text className="text-base font-bold text-white">
                Analyzing...
              </Text>
            </>
          ) : (
            <>
              <Icon name="sparkles" size={20} color="#fff" />
              <Text className="text-base font-bold text-white">
                Analyze Seeds
              </Text>
            </>
          )}
        </Pressable>

        {/* Retake */}
        <Pressable
          className="rounded-2xl bg-sf-bg-3 p-4 flex-row items-center justify-center gap-2 border border-card-border active:opacity-70"
          onPress={() => router.back()}
          disabled={isPending}
        >
          <Icon name="arrow-back" size={18} color="#1C1C1E" />
          <Text className="text-base font-semibold text-sf-text">Retake</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
