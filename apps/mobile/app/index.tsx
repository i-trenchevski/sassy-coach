import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { isOnboardingComplete } from "@/utils/storage";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    isOnboardingComplete().then((complete) => {
      setOnboarded(complete);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0D0D0D", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color="#E94560" size="large" />
      </View>
    );
  }

  if (onboarded) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(onboarding)/goal" />;
}
