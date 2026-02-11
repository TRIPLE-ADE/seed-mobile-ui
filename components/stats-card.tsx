import { View, Text } from "../tw";

interface StatsCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export function StatsCard({ label, value, color }: StatsCardProps) {
  return (
    <View
      style={[{ flex: 1, borderCurve: "continuous", ...(process.env.EXPO_OS === "android" ? { elevation: 1 } : undefined) }]}
    >
      <View className="flex-1 rounded-2xl bg-sf-bg-3 p-4 gap-1.5 border border-card-border">
        <Text className="text-sm font-semibold text-sf-text-2 uppercase tracking-wider">
          {label}
        </Text>
        <Text
          style={{ fontSize: 24, fontWeight: "700", fontVariant: ["tabular-nums"], color: color }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
