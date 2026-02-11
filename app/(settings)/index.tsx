import { useEffect, useState } from "react";
import { Switch } from "react-native";
import { View, Text, ScrollView, Pressable } from "../../tw";
import { Icon } from "../../components/icon";
import {
  getSettings,
  saveSettings,
  type AppSettings,
} from "../../stores/scan-store";
import { useHealthCheck } from "../../api/hooks";

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  // Health check as a React Query
  const {
    data: healthData,
    isLoading: healthLoading,
    isError: healthError,
    refetch: refetchHealth,
  } = useHealthCheck(true);

  const serverStatus = healthLoading
    ? "checking"
    : healthError
      ? "offline"
      : "online";

  useEffect(() => {
    getSettings().then((s) => {
      setSettings(s);
    });
  }, []);

  const handleConfidenceChange = async (value: number) => {
    const rounded = Math.round(value * 100) / 100;
    const updated = await saveSettings({ confidence: rounded });
    setSettings(updated);
  };

  const handleAutoSaveToggle = async (value: boolean) => {
    const updated = await saveSettings({ autoSave: value });
    setSettings(updated);
  };

  if (!settings) return null;

  const statusColor =
    serverStatus === "online"
      ? "#22c55e"
      : serverStatus === "offline"
        ? "#FF3B30"
        : "#FF9500";

  const statusBg =
    serverStatus === "online"
      ? "rgba(34,197,94,0.08)"
      : serverStatus === "offline"
        ? "rgba(255,59,48,0.08)"
        : "rgba(255,149,0,0.08)";

  return (
    <ScrollView
      className="flex-1 bg-sf-bg"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="p-4 pb-24 gap-6"
    >
      {/* Server Connection */}
      <View className="gap-2">
        <Text className="text-xs font-semibold text-sf-text-2 uppercase tracking-wider px-1">
          Server
        </Text>
        <View
          className="rounded-2xl bg-sf-bg-3 overflow-hidden border border-card-border"
        >
          {/* Status */}
          <View className="flex-row items-center gap-3 p-4">
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: statusBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name={
                  serverStatus === "online"
                    ? "cloud-done"
                    : serverStatus === "offline"
                      ? "cloud-offline"
                      : "sync"
                }
                size={18}
                color={statusColor}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-sf-text">
                {serverStatus === "online"
                  ? "Connected"
                  : serverStatus === "offline"
                    ? "Offline"
                    : "Checking..."}
              </Text>
              {healthData && (
                <Text className="text-xs text-sf-text-2" selectable>
                  {Object.values(healthData.classes).join(", ")}
                </Text>
              )}
            </View>
            <Pressable
              className="rounded-xl bg-[rgba(0,122,255,0.08)] px-4 py-2 active:opacity-70"
              onPress={() => refetchHealth()}
            >
              <Text className="text-sm font-semibold text-sf-blue">Test</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Detection Settings */}
      <View className="gap-2">
        <Text className="text-xs font-semibold text-sf-text-2 uppercase tracking-wider px-1">
          Detection
        </Text>
        <View
          className="rounded-2xl bg-sf-bg-3 overflow-hidden border border-card-border"
        >
          {/* Confidence */}
          <View className="p-4 gap-3 border-b border-card-border">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <Icon name="speedometer-outline" size={18} color="#8A8A8E" />
                <Text className="text-base text-sf-text">
                  Confidence Threshold
                </Text>
              </View>
              <Text
                className="text-base font-bold text-primary tabular-nums"
              >
                {Math.round(settings.confidence * 100)}%
              </Text>
            </View>
            <View className="flex-row gap-2">
              {[0.25, 0.5, 0.75].map((val) => {
                const isActive = settings.confidence === val;
                return (
                  <Pressable
                    key={val}
                    className={`flex-1 rounded-xl py-2.5 items-center active:opacity-70 border border-card-border ${isActive ? "bg-primary" : ""
                      }`}
                    onPress={() => handleConfidenceChange(val)}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: isActive ? "#ffffff" : "#8A8A8E",
                      }}
                    >
                      {Math.round(val * 100)}%
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Auto Save */}
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-2 flex-1">
              <Icon name="save-outline" size={18} color="#8A8A8E" />
              <View className="flex-1">
                <Text className="text-base text-sf-text">Auto-save Scans</Text>
                <Text className="text-sm text-sf-text-2">
                  Save results to history automatically
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={handleAutoSaveToggle}
              trackColor={{ false: "#E5E5EA", true: "#10b981" }}
              thumbColor={
                process.env.EXPO_OS === "android" ? "#fff" : undefined
              }
            />
          </View>
        </View>
      </View>

      {/* About */}
      <View className="gap-2">
        <Text className="text-xs font-semibold text-sf-text-2 uppercase tracking-wider px-1">
          About
        </Text>
        <View
          className="rounded-2xl bg-sf-bg-3 p-4 gap-3 border border-card-border"
        >
          <View className="flex-row items-center gap-3">
            <View className="items-center justify-center w-12 h-12 rounded-xl bg-primary-light"
             
            >
              <Icon name="leaf" size={22} color="#10b981" />
            </View>
            <View>
              <Text className="text-base font-bold text-sf-text">
                Seed Scanner
              </Text>
              <Text className="text-sm text-sf-text-2">Version 1.0.0</Text>
            </View>
          </View>
          <Text className="text-sm text-sf-text-2">
            AI-powered seed damage detection using YOLO computer vision.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
