import {
  NativeTabs,
  Icon,
  Label,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(scan)">
        <Icon
          sf={{ default: "viewfinder", selected: "viewfinder" }}
          androidSrc={
            <VectorIcon family={Ionicons} name="scan-outline" />
          }
        />
        <Label>Scan</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(history)">
        <Icon
          sf={{ default: "clock", selected: "clock.fill" }}
          androidSrc={
            <VectorIcon family={Ionicons} name="time-outline" />
          }
        />
        <Label>History</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(settings)">
        <Icon
          sf={{ default: "gear", selected: "gear" }}
          androidSrc={
            <VectorIcon family={Ionicons} name="settings-outline" />
          }
        />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
