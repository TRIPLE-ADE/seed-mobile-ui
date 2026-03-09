import { View, Text, Link } from "@/tw";
import { Image } from "@/tw/image";
import { Icon } from "./icon";
import type { ScanRecord } from "@/stores/scan-store";

interface ScanItemProps {
  scan: ScanRecord;
}

export function ScanItem({ scan }: ScanItemProps) {
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
    <Link
      href={{ pathname: "/results", params: { scanId: scan.id } }}
      className="rounded-2xl bg-sf-bg-3 p-3 border border-card-border active:opacity-70"
    >
      <View className="flex-row justify-between gap-3 w-full">
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
      </View>
    </Link>
  );
}
