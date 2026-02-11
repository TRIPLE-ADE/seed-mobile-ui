import { router } from "expo-router";
import { View, Text, Pressable } from "../tw";
import { Icon } from "../components/icon";

export default function NotFound() {
  return (
    <View className="flex-1 items-center justify-center bg-sf-bg gap-5 px-8">
      <View className="items-center justify-center rounded-full w-30 h-30 bg-sf-bg-2">
        <Icon name="help-circle-outline" size={40} color="#AEAEB2" />
      </View>
      <Text className="text-xl font-bold text-sf-text">Page not found</Text>
      <Pressable className="rounded-2xl bg-primary px-6 py-3 active:opacity-80" onPress={() => router.replace("/")}>
        <Text className="text-base font-bold text-white">Go Home</Text>
      </Pressable>
    </View>
  );
}
