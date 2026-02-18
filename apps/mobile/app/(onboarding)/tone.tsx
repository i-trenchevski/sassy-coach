import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import type { Tone } from "@sassy-coach/shared";
import { SafeAreaView } from "react-native-safe-area-context";
import { ToneSelector } from "@/components/ToneSelector";
import { Button } from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";

export default function ToneScreen() {
  const router = useRouter();
  const { goal } = useLocalSearchParams<{ goal: string }>();
  const [selected, setSelected] = useState<Tone | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 2 of 3</Text>
        <Text style={styles.title}>Pick your coach's vibe</Text>
        <Text style={styles.subtitle}>Choose how your coach talks to you</Text>
      </View>

      <View style={styles.selector}>
        <ToneSelector selected={selected} onSelect={setSelected} />
      </View>

      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={() =>
            router.push({
              pathname: "/(onboarding)/preview",
              params: { goal, tone: selected! },
            })
          }
          disabled={!selected}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  content: {
    paddingTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  step: {
    ...typography.caption,
    marginBottom: spacing.sm,
    color: colors.accent,
    fontWeight: "600",
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
  },
  selector: {
    flex: 1,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
