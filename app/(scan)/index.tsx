import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { View, Text, ScrollView, Pressable } from "../../tw";
import { Icon } from "../../components/icon";
import { StatsCard } from "../../components/stats-card";
import { ScanItem } from "../../components/scan-item";
import { getScans, type ScanRecord } from "../../stores/scan-store";

export default function HomeScreen() {
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      getScans().then((scans) => setRecentScans(scans.slice(0, 5)));
    }, [])
  );

  const totalScans = recentScans.length;
  const avgHealth =
    totalScans > 0
      ? Math.round(
        recentScans.reduce((sum, s) => sum + s.healthPercentage, 0) /
        totalScans
      )
      : 0;
  const totalSeeds = recentScans.reduce(
    (sum, s) => sum + s.totalDetections,
    0
  );

  const handleCamera = async () => {
    if (process.env.EXPO_OS === "ios") await Haptics.selectionAsync();
    router.push("/(scan)/camera");
  };

  const handleGallery = async () => {
    if (process.env.EXPO_OS === "ios") await Haptics.selectionAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      router.push({
        pathname: "/(scan)/confirm",
        params: {
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        },
      });
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-sf-bg"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-4 pb-24 gap-6"
    >
      {/* Quick Stats */}
      {totalScans > 0 && (
        <View className="flex-row gap-3">
          <StatsCard label="Health" value={`${avgHealth}%`} color="#22c55e" />
          <StatsCard label="Seeds" value={totalSeeds} />
          <StatsCard label="Scans" value={totalScans} />
        </View>
      )}

      {/* Action Buttons */}
      <View className="gap-3">
        {/* Primary CTA — Scan Seeds */}
        <Pressable
          className="rounded-2xl bg-primary p-5 items-center gap-2 active:opacity-80 border border-card-border shadow-sm"
          onPress={handleCamera}
        >
          <View
            className="items-center justify-center rounded-full w-16 h-16 bg-white/20"
          >
            <Icon name="camera" size={28} color="#fff" />
          </View>
          <Text className="text-lg font-bold text-white">Scan Seeds</Text>
          <Text className="text-sm text-white/70">
            Take a photo to detect seed damage
          </Text>
        </Pressable>

        {/* Secondary CTA — Upload */}
        <Pressable
          className="bg-sf-bg-3 p-4 flex-row items-center gap-3 active:opacity-70 rounded-2xl border border-card-border"
          onPress={handleGallery}
        >
          <View className="items-center justify-center rounded-full w-12 h-12 bg-primary-light"
          >
            <Icon name="images-outline" size={20} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-sf-text">
              Upload from Gallery
            </Text>
            <Text className="text-sm text-sf-text-2">
              Pick an existing photo or video
            </Text>
          </View>
          <Icon name="chevron-forward" size={16} color="#AEAEB2" />
        </Pressable>
      </View>

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <View className="gap-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-sf-text">
              Recent Scans
            </Text>
            <Pressable
              className="active:opacity-60"
              onPress={() => router.push("/(history)")}
            >
              <Text className="text-sm font-semibold text-primary">
                See All
              </Text>
            </Pressable>
          </View>
          {recentScans.map((scan) => (
            <ScanItem
              key={scan.id}
              scan={scan}
              onPress={() =>
                router.push({
                  pathname: "/(scan)/results",
                  params: { scanId: scan.id },
                })
              }
            />
          ))}
        </View>
      )}

      {/* Empty State */}
      {totalScans === 0 && (
        <View className="items-center gap-4 pt-10 px-4">
          <View className="items-center justify-center rounded-full w-20 h-20 bg-primary-light">
            <Icon name="leaf-outline" size={40} color="#10b981" />
          </View>
          <Text className="text-xl font-bold text-sf-text">No scans yet</Text>
          <Text className="text-base text-sf-text-2 text-center">
            Take a photo or upload an image to start detecting seed damage.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
