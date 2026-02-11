import Stack from "expo-router/stack";

export default function HistoryLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "History",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
