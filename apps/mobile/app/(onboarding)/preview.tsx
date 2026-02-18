import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import type { Goal, Tone, User } from "@sassy-coach/shared";
import type { DailyMission } from "@sassy-coach/shared";
import { SafeAreaView } from "react-native-safe-area-context";
import { MissionPreview } from "@/components/MissionPreview";
import { Button } from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";
import { pickMission } from "@/constants/mockMissions";
import { saveUser, saveMissions, setOnboardingComplete } from "@/utils/storage";
import { getToday } from "@/utils/dates";
import { api } from "@/utils/api";

export default function PreviewScreen() {
  const router = useRouter();
  const { goal, tone } = useLocalSearchParams<{ goal: string; tone: string }>();

  const typedGoal = goal as Goal;
  const typedTone = tone as Tone;

  const [mission, setMission] = useState<DailyMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  // Stable refs so the effect doesn't re-run
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      const today = getToday();
      const userId = Crypto.randomUUID();

      const user: User = {
        id: userId,
        email: null,
        goal: typedGoal,
        tone: typedTone,
        isPremium: false,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        streakCount: 0,
        lastCompletedDate: null,
        lastGeneratedDate: today,
      };
      userRef.current = user;

      // Register + generate in one go
      let generated: DailyMission;
      try {
        await api.register({
          id: userId,
          goal: typedGoal,
          tone: typedTone,
          timezone: user.timezone,
        });
        const { mission: remoteMission } = await api.generateMission({
          userId,
          goal: typedGoal,
          tone: typedTone,
        });
        generated = remoteMission;
      } catch {
        // API unreachable — fall back to mock mission
        const template = pickMission(typedGoal, []);
        generated = {
          id: `mission-${today}-${userId}`,
          userId,
          date: today,
          task: template.task,
          sass: template.sass[typedTone],
          reflectionQuestion: template.reflectionQuestion,
          completed: false,
          reflectionAnswer: null,
        };
      }

      if (!cancelled) {
        setMission(generated);
        setLoading(false);
      }
    }

    generate();
    return () => {
      cancelled = true;
    };
  }, [typedGoal, typedTone]);

  const handleStart = async () => {
    if (!mission || !userRef.current) return;
    setStarting(true);
    try {
      await saveUser(userRef.current);
      await saveMissions([mission]);
      await setOnboardingComplete();
      router.replace("/(tabs)/home");
    } finally {
      setStarting(false);
    }
  };

  const previewData = mission
    ? { task: mission.task, sass: mission.sass, reflectionQuestion: mission.reflectionQuestion }
    : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.step}>Step 3 of 3</Text>
        <Text style={styles.title}>Here's your daily mission</Text>
        <Text style={styles.subtitle}>
          You'll get one of these every day. Simple, actionable, no overwhelm.
        </Text>
      </View>

      <View style={styles.preview}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Generating your mission...</Text>
          </View>
        ) : (
          previewData && <MissionPreview mission={previewData} />
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title={starting ? "Setting up..." : "Let's Go 🚀"}
          onPress={handleStart}
          disabled={loading || starting}
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
  preview: {
    flex: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    alignItems: "center",
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
