import Stack from "expo-router/stack";

export default function ScanLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Seed Scanner",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
