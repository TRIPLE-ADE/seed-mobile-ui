import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import { useFocusEffect, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { View, Text, ScrollView, Pressable } from "../../tw";
import { Icon } from "../../components/icon";
import { ScanItem } from "../../components/scan-item";
import {
  getScans,
  deleteScan,
  clearScans,
  type ScanRecord,
} from "../../stores/scan-store";

export default function HistoryScreen() {
  const [scans, setScans] = useState<ScanRecord[]>([]);

  useFocusEffect(
    useCallback(() => {
      getScans().then(setScans);
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert("Delete Scan", "Are you sure you want to delete this scan?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (Platform.OS === "ios")
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning
            );
          await deleteScan(id);
          setScans((prev) => prev.filter((s) => s.id !== id));
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Scans",
      "This will permanently delete all scan history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearScans();
            setScans([]);
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-sf-bg"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-4 pb-24 gap-3"
    >
      {scans.length > 0 && (
        <View className="flex-row justify-between items-center mb-1 px-1">
          <Text className="text-sm font-medium text-sf-text-2">
            {scans.length} scan{scans.length !== 1 ? "s" : ""}
          </Text>
          <Pressable className="active:opacity-60" onPress={handleClearAll}>
            <Text className="text-sm font-semibold text-red-500">
              Clear All
            </Text>
          </Pressable>
        </View>
      )}

      {scans.map((scan) => (
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

      {scans.length === 0 && (
        <View className="items-center gap-4 pt-20 px-4">
          <View className="items-center justify-center rounded-full w-24 h-24 bg-sf-bg-2"
          >
            <Icon name="time-outline" size={40} color="#AEAEB2" />
          </View>
          <Text className="text-xl font-bold text-sf-text">No scan history</Text>
          <Text className="text-base text-sf-text-2 text-center">Your scan results will appear here after you analyze some seeds.</Text>
        </View>
      )}
    </ScrollView>
  );
}
