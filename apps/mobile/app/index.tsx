import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import {
  isOnboardingComplete,
  setOnboardingComplete,
  saveUser,
} from "@/utils/storage";
import { useAuthContext } from "@/contexts/AuthContext";
import { api } from "@/utils/api";

export default function Index() {
  const { session, loading: authLoading } = useAuthContext();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session) return;

    async function checkStatus() {
      // First check local storage
      const localComplete = await isOnboardingComplete();
      if (localComplete) {
        setOnboarded(true);
        return;
      }

      // Not in local storage — check if user exists on server (returning user after logout)
      try {
        const { user } = await api.getUser();
        if (user) {
          // Restore user data locally and skip onboarding
          await saveUser(user);
          await setOnboardingComplete();
          setOnboarded(true);
          return;
        }
      } catch {
        // User doesn't exist on server — needs onboarding
      }

      setOnboarded(false);
    }

    checkStatus();
  }, [session]);

  // Still loading auth or onboarding check
  if (authLoading || (session && onboarded === null)) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0D0D0D", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#E94560" size="large" />
      </View>
    );
  }

  // Not authenticated → go to login
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  // Authenticated but not onboarded → go to onboarding
  if (!onboarded) {
    return <Redirect href="/(onboarding)/goal" />;
  }

  // Fully set up → go to app
  return <Redirect href="/(tabs)/home" />;
}
