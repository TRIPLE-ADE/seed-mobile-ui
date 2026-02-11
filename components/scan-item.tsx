import { View, Text, Pressable } from "../tw";
import { Image } from "../tw/image";
import { Icon } from "./icon";
import type { ScanRecord } from "../stores/scan-store";

interface ScanItemProps {
  scan: ScanRecord;
  onPress: () => void;
}

export function ScanItem({ scan, onPress }: ScanItemProps) {
  const date = new Date(scan.timestamp);
  const dateStr = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const healthColor =
    scan.healthPercentage >= 70
      ? "#22c55e"
      : scan.healthPercentage >= 40
      ? "#f59e0b"
      : "#ef4444";

  return (
    <View style={{ borderCurve: "continuous", borderRadius: 16 }}>
      <Pressable
        className="flex-row gap-3 rounded-2xl bg-sf-bg-3 p-3 border border-card-border active:opacity-70"
        onPress={onPress}
      >
        {/* Thumbnail */}
        <View className="w-16 h-16 rounded-xl overflow-hidden bg-sf-bg-2">
          <Image
            className="w-16 h-16"
            source={{ uri: scan.annotatedUrl }}
            contentFit="cover"
          />
        </View>

        {/* Details */}
        <View className="flex-1 gap-0.5 justify-center">
          <Text className="text-base font-semibold text-sf-text">
            {scan.totalDetections} seed{scan.totalDetections !== 1 ? "s" : ""}{" "}
            detected
          </Text>
          <Text className="text-sm text-sf-text-2">
            {dateStr} at {timeStr}
          </Text>
        </View>

        {/* Health % + Chevron */}
        <View className="items-end justify-center gap-1">
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              fontVariant: ["tabular-nums"],
              color: healthColor,
            }}
          >
            {scan.healthPercentage}%
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-xs text-sf-text-2">healthy</Text>
            <Icon name="chevron-forward" size={12} color="#AEAEB2" />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
