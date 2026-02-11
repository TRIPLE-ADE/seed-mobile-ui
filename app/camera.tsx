import { useRef, useState } from "react";
import { router } from "expo-router";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable } from "../tw";
import { Icon } from "../components/icon";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState(false);
  const { top } = useSafeAreaInsets();

  if (!permission?.granted) {
    return (
      <View
        className={`flex-1 justify-center items-center bg-sf-bg gap-5 px-8 ${top ? `pt-${top}` : ""}`}
      >
        <View
          className="items-center justify-center rounded-full w-30 h-30 bg-sf-bg-2"
        >
          <Icon name="camera-outline" size={40} color="#8A8A8E" />
        </View>
        <Text className="text-xl font-bold text-sf-text text-center">
          Camera Access Required
        </Text>
        <Text className="text-base text-sf-text-2 text-center">
          We need camera access to photograph seeds for damage detection.
        </Text>
        <Pressable
          className="rounded-2xl bg-primary px-8 py-4 active:opacity-80 border border-card-border"
          onPress={requestPermission}
        >
          <Text className="text-base font-bold text-white">
            Grant Permission
          </Text>
        </Pressable>
        <Pressable className="active:opacity-60" onPress={() => router.back()}>
          <Text className="text-base font-semibold text-primary">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const takePhoto = async () => {
    if (process.env.EXPO_OS === "ios")
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo) {
      router.push({
        pathname: "/confirm",
        params: { uri: photo.uri, type: "image" },
      });
    }
  };

  const pickFromGallery = async () => {
    if (process.env.EXPO_OS === "ios") await Haptics.selectionAsync();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      router.push({
        pathname: "/confirm",
        params: {
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
        },
      });
    }
  };

  const toggleFlash = async () => {
    if (process.env.EXPO_OS === "ios") await Haptics.selectionAsync();
    setFlash((f) => !f);
  };

  const flipCamera = async () => {
    if (process.env.EXPO_OS === "ios") await Haptics.selectionAsync();
    setFacing((f) => (f === "back" ? "front" : "back"));
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        enableTorch={flash}
      />

      {/* Top bar */}
      <View className="absolute left-0 right-0 flex-row justify-between items-center px-4 top-10">
        <Pressable
          className="w-11 h-11 rounded-full bg-black/45 items-center justify-center active:opacity-70"
          onPress={() => router.back()}
        >
          <Icon name="close" size={22} color="#fff" />
        </Pressable>
        <Pressable
          className="w-11 h-11 rounded-full bg-black/45 items-center justify-center active:opacity-70"
          onPress={toggleFlash}
        >
          <Icon
            name={flash ? "flash" : "flash-off-outline"}
            size={20}
            color={flash ? "#fbbf24" : "#fff"}
          />
        </Pressable>
      </View>

      {/* Tip */}
      <View className="absolute left-4 right-4 items-center rounded-2xl px-4 py-3 top-20 bg-black/55">
        <Text className="text-base text-white text-center">
          Place seeds on a flat, well-lit surface for best results
        </Text>
      </View>

      {/* Bottom controls */}
      <View
        className={`absolute left-0 right-0 items-center gap-5 bottom-30`}
      >
        {/* Shutter button */}
        <Pressable
          onPress={takePhoto}
          className="w-19 h-19 rounded-full border-4 border-white bg-white/25 justify-center items-center active:opacity-70"

        >
          <View
            className="w-15 h-15 rounded-full bg-white"
          />
        </Pressable>

        {/* Gallery + Flip */}
        <View className="flex-row gap-10">
          <Pressable
            className="w-12 h-12 rounded-full bg-white/20 items-center justify-center active:opacity-70"
            onPress={pickFromGallery}
          >
            <Icon name="images-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable
            className="w-12 h-12 rounded-full bg-white/20 items-center justify-center active:opacity-70"
            onPress={flipCamera}
          >
            <Icon name="camera-reverse-outline" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
