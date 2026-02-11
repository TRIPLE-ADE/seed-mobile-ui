import { useEffect, useState } from "react";
import { PixelRatio } from "react-native";
import {
  NativeTabs,
  Icon,
  Label
} from "expo-router/unstable-native-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ImageSourcePropType } from "react-native";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

/** Render a crisp icon bitmap at the device's native pixel density */
function useTabIcon(name: IoniconsName) {
  const [source, setSource] = useState<ImageSourcePropType | null>(null);
  useEffect(() => {
    const size = 24 * PixelRatio.get(); // e.g. 72px on a 3x screen
    Ionicons.getImageSource(name, size, "#8E8E93").then((src) => {
      if (src) setSource(src);
    });
  }, [name]);
  return source;
}

export default function TabsLayout() {
  const scanIcon = useTabIcon("scan-outline");
  const historyIcon = useTabIcon("time-outline");
  const settingsIcon = useTabIcon("settings-outline");

  return (
    <NativeTabs backgroundColor="#f2f2f7" indicatorColor="#d1fae5">
      <NativeTabs.Trigger name="(scan)">
        <Icon
          sf={{ default: "viewfinder", selected: "viewfinder" }}
          androidSrc={scanIcon ?? undefined}
        />
        <Label>Scan</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(history)">
        <Icon
          sf={{ default: "clock", selected: "clock.fill" }}
          androidSrc={historyIcon ?? undefined}
        />
        <Label>History</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <Icon
          sf={{ default: "gear", selected: "gear" }}
          androidSrc={settingsIcon ?? undefined}
        />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
