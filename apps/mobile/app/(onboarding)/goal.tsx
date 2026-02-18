import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import type { Goal } from "@sassy-coach/shared";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoalSelector } from "@/components/GoalSelector";
import { Button } from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";

export default function GoalScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Goal | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 1 of 3</Text>
        <Text style={styles.title}>What are you working on?</Text>
        <Text style={styles.subtitle}>Pick a goal and we'll tailor your daily missions</Text>
      </View>

      <View style={styles.selector}>
        <GoalSelector selected={selected} onSelect={setSelected} />
      </View>

      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={() =>
            router.push({
              pathname: "/(onboarding)/tone",
              params: { goal: selected! },
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
