import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import type { Goal, Tone, User } from "@sassy-coach/shared";
import type { DailyMission } from "@sassy-coach/shared";
import { SafeAreaView } from "react-native-safe-area-context";
import { MissionPreview } from "@/components/MissionPreview";
import { Button } from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";
import { pickMission } from "@/constants/mockMissions";
import { saveUser, saveMissions, getMissions, setOnboardingComplete } from "@/utils/storage";
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

  const userRef = useRef<User | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function generate() {
      const today = getToday();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Register user with API (links Supabase Auth to app user)
      let registeredUser: User | null = null;
      try {
        const { user } = await api.register({
          goal: typedGoal,
          tone: typedTone,
          timezone,
        });
        registeredUser = user;
      } catch {
        // API unreachable — create a local-only user
      }

      const user: User = registeredUser ?? {
        id: "local",
        authId: null,
        email: null,
        goal: typedGoal,
        tone: typedTone,
        isPremium: false,
        timezone,
        streakCount: 0,
        lastCompletedDate: null,
        lastGeneratedDate: today,
      };
      userRef.current = user;

      // Generate first mission
      let generated: DailyMission;
      try {
        const { mission: remoteMission } = await api.generateMission({
          goal: typedGoal,
          tone: typedTone,
        });
        generated = remoteMission;
      } catch {
        // API unreachable — fall back to mock mission
        const template = pickMission(typedGoal, []);
        generated = {
          id: `mission-${today}-fallback`,
          userId: user.id,
          date: today,
          task: template.task,
          sass: template.sass[typedTone],
          reflectionQuestion: template.reflectionQuestion,
          completed: false,
          reflectionAnswer: null,
          rerollCount: 0,
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
      // Append new mission to existing history (don't wipe returning user's data)
      const existing = await getMissions();
      const merged = existing.some((m) => m.id === mission.id)
        ? existing
        : [...existing, mission];
      await saveMissions(merged);
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
