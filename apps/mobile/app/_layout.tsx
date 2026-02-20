import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/contexts/AuthContext";
import { setupNotificationHandler, scheduleDailyReminder } from "@/utils/notifications";
import { getNotificationPrefs } from "@/utils/storage";

// Register how notifications are handled while the app is foregrounded
setupNotificationHandler();

export default function RootLayout() {
  useEffect(() => {
    // Restore scheduled reminder if the user had it enabled
    getNotificationPrefs().then(({ enabled, hour, minute }) => {
      if (enabled) {
        scheduleDailyReminder(hour, minute).catch(() => {});
      }
    });
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#0D0D0D" }}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#0D0D0D" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
