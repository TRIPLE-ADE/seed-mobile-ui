import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Stack from "expo-router/stack";
import "./global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerBackButtonDisplayMode: "minimal" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}  />
        <Stack.Screen name="camera" options={{ headerShown: false }} />
        <Stack.Screen
          name="confirm"
          options={{ title: "Confirm", presentation: "modal" }}
        />
        <Stack.Screen name="results" options={{ title: "Results" }} />
        <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
      </Stack>
    </QueryClientProvider>
  );
}
