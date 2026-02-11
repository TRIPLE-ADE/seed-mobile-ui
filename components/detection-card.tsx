import { View, Text } from "../tw";
import { Icon } from "./icon";
import type { Detection } from "../api/detection";

interface DetectionCardProps {
  detection: Detection;
  index: number;
}

export function DetectionCard({ detection, index }: DetectionCardProps) {
  const isHealthy = detection.class === "healthy";
  const accentColor = isHealthy ? "#22c55e" : "#ef4444";
  const bgTint = isHealthy
    ? "rgba(34, 197, 94, 0.08)"
    : "rgba(239, 68, 68, 0.08)";
  const confidencePercent = Math.round(detection.confidence * 100);

  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl bg-sf-bg-3 p-4 border border-card-border"
    >
      {/* Status icon */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: bgTint,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name={isHealthy ? "checkmark-circle" : "alert-circle"}
          size={20}
          color={accentColor}
        />
      </View>

      {/* Label */}
      <View className="flex-1 gap-0.5">
        <Text
          className="text-base font-semibold text-sf-text capitalize"
          selectable
        >
          {detection.class}
        </Text>
        <Text className="text-sm text-sf-text-2" selectable>
          Seed #{index + 1}
        </Text>
      </View>

      {/* Confidence badge */}
      <View
        style={{
          backgroundColor: bgTint,
          borderCurve: "continuous",
          padding: 10,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            fontVariant: ["tabular-nums"],
            color: accentColor,
          }}
        >
          {confidencePercent}%
        </Text>
      </View>
    </View>
  );
}
