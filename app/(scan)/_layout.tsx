import Stack from "expo-router/stack";

export default function ScanLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Seed Scanner",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          title: "Capture",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="confirm"
        options={{
          title: "Confirm",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="results"
        options={{
          title: "Results",
        }}
      />
    </Stack>
  );
}
