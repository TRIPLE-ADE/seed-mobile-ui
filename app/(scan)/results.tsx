import { useEffect, useState } from "react";
import { Alert, Share } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { View, Text, ScrollView, Pressable } from "../../tw";
import { Image } from "../../tw/image";
import { Icon } from "../../components/icon";
import { StatsCard } from "../../components/stats-card";
import { DetectionCard } from "../../components/detection-card";
import {
  saveScan,
  createScanRecord,
  getScans,
  type ScanRecord,
} from "../../stores/scan-store";
import type { Detection } from "../../api/detection";

export default function ResultsScreen() {
  const params = useLocalSearchParams<{
    detections?: string;
    totalDetections?: string;
    annotatedUrl?: string;
    sourceUri?: string;
    mediaType?: string;
    scanId?: string;
  }>();

  const [scan, setScan] = useState<ScanRecord | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (params.scanId) {
      // Loading from history
      getScans().then((scans) => {
        const found = scans.find((s) => s.id === params.scanId);
        if (found) {
          setScan(found);
          setSaved(true);
        }
      });
    } else if (params.detections && params.annotatedUrl) {
      // Fresh result from detection
      const detections: Detection[] = JSON.parse(params.detections);
      const record = createScanRecord(
        detections,
        params.annotatedUrl,
        params.sourceUri || "",
        (params.mediaType as "image" | "video") || "image"
      );
      setScan(record);

      // Auto-save
      saveScan(record).then(() => setSaved(true));
    }
  }, []);

  if (!scan) {
    return (
      <View className="flex-1 items-center justify-center bg-sf-bg gap-3">
        <Icon name="hourglass-outline" size={28} color="#8A8A8E" />
        <Text className="text-base text-sf-text-2">Loading results...</Text>
      </View>
    );
  }

  const healthColor =
    scan.healthPercentage >= 70
      ? "#22c55e"
      : scan.healthPercentage >= 40
      ? "#f59e0b"
      : "#ef4444";

  const healthBg =
    scan.healthPercentage >= 70
      ? "rgba(34, 197, 94, 0.08)"
      : scan.healthPercentage >= 40
      ? "rgba(245, 158, 11, 0.08)"
      : "rgba(239, 68, 68, 0.08)";

  const handleShare = async () => {
    if (process.env.EXPO_OS === "ios") await Haptics.selectionAsync();
    try {
      await Share.share({
        message: `Seed Scan Results:\n${scan.totalDetections} seeds detected\n${scan.healthyCount} healthy, ${scan.damageCount} damaged\nHealth: ${scan.healthPercentage}%`,
      });
    } catch {}
  };

  const handleNewScan = async () => {
    if (process.env.EXPO_OS === "ios") await Haptics.selectionAsync();
    router.replace("/(scan)");
  };

  return (
    <ScrollView
      className="flex-1 bg-sf-bg"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-4 pb-24 gap-5"
    >
      {/* Summary Cards */}
      <View className="flex-row gap-3">
        <StatsCard label="Total" value={scan.totalDetections} />
        <StatsCard
          label="Healthy"
          value={scan.healthyCount}
          color="#22c55e"
        />
        <StatsCard label="Damaged" value={scan.damageCount} color="#ef4444" />
      </View>

      {/* Health Percentage Hero */}
      <View
        className="rounded-2xl bg-sf-bg-3 p-6 items-center gap-3 border border-card-border"
      >
        <Text className="text-sm font-semibold text-sf-text-2 uppercase tracking-wider">
          Seed Health
        </Text>

        {/* Circular health indicator */}
        <View 
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: healthBg,
            borderWidth: 3,
            borderColor: healthColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              fontVariant: ["tabular-nums"],
              color: healthColor,
            }}
            selectable
          >
            {scan.healthPercentage}%
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <Icon
            name={
              scan.healthPercentage >= 70
                ? "checkmark-circle"
                : scan.healthPercentage >= 40
                ? "warning"
                : "alert-circle"
            }
            size={16}
            color={healthColor}
          />
          <Text style={{ fontSize: 14, color: healthColor, fontWeight: "600" }}>
            {scan.healthPercentage >= 70
              ? "Good condition"
              : scan.healthPercentage >= 40
              ? "Moderate damage detected"
              : "Significant damage detected"}
          </Text>
        </View>
      </View>

      {/* Annotated Image */}
      <View className="gap-3">
        <Text className="text-lg font-bold text-sf-text">Annotated Result</Text>
        <View className="rounded-2xl overflow-hidden bg-sf-bg-2 border border-card-border aspect-square">
          <Image
            className="flex-1"
            source={{ uri: scan.annotatedUrl }}
            contentFit="contain"
          />
        </View>
      </View>

      {/* Detections List */}
      <View className="gap-3">
        <Text className="text-lg font-bold text-sf-text">
          Detections ({scan.totalDetections})
        </Text>
        {scan.detections.map((detection, idx) => (
          <DetectionCard key={idx} detection={detection} index={idx} />
        ))}
      </View>

      {/* Action Buttons */}
      <View className="gap-3 pt-2">
        <View style={{ borderCurve: "continuous", borderRadius: 16, boxShadow: "0 2px 8px rgba(16,185,129,0.25)" }}>
          <Pressable
            className="rounded-2xl bg-primary p-4 flex-row items-center justify-center gap-2 active:opacity-80"
            onPress={handleNewScan}
          >
            <Icon name="scan-outline" size={20} color="#fff" />
            <Text className="text-base font-bold text-white">New Scan</Text>
          </Pressable>
        </View>

        <View style={{ borderCurve: "continuous", borderRadius: 16 }}>
          <Pressable
            className="rounded-2xl bg-sf-bg-3 p-4 flex-row items-center justify-center gap-2 border border-card-border active:opacity-70"
            onPress={handleShare}
          >
            <Icon name="share-outline" size={18} color="#007AFF" />
            <Text className="text-base font-semibold" style={{ color: "#007AFF" }}>
              Share Results
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
