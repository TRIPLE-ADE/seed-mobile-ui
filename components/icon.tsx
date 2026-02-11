import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface IconProps {
  name: IoniconsName;
  size?: number;
  color?: string;
}

/**
 * Cross-platform icon component using Ionicons.
 * Works identically on iOS and Android — replaces SF Symbol usage.
 */
export function Icon({ name, size = 24, color = "#8A8A8E" }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
