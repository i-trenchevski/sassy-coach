import { View, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import type { Goal, Tone, User } from "@sassy-coach/shared";
import { SafeAreaView } from "react-native-safe-area-context";
import { MissionPreview } from "@/components/MissionPreview";
import { Button } from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";
import { pickMission } from "@/constants/mockMissions";
import { saveUser, saveMissions, setOnboardingComplete } from "@/utils/storage";
import { getToday } from "@/utils/dates";

export default function PreviewScreen() {
  const router = useRouter();
  const { goal, tone } = useLocalSearchParams<{ goal: string; tone: string }>();

  const typedGoal = goal as Goal;
  const typedTone = tone as Tone;

  const template = pickMission(typedGoal, []);
  const previewMission = {
    task: template.task,
    sass: template.sass[typedTone],
    reflectionQuestion: template.reflectionQuestion,
  };

  const handleStart = async () => {
    const today = getToday();
    const user: User = {
      id: "local-user-001",
      email: null,
      goal: typedGoal,
      tone: typedTone,
      isPremium: false,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      streakCount: 0,
      lastCompletedDate: null,
      lastGeneratedDate: today,
    };

    const firstMission = {
      id: `mission-${today}`,
      userId: user.id,
      date: today,
      task: previewMission.task,
      sass: previewMission.sass,
      reflectionQuestion: previewMission.reflectionQuestion,
      completed: false,
      reflectionAnswer: null,
    };

    await saveUser(user);
    await saveMissions([firstMission]);
    await setOnboardingComplete();
    router.replace("/(tabs)/home");
  };

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
        <MissionPreview mission={previewMission} />
      </View>

      <View style={styles.footer}>
        <Button title="Let's Go 🚀" onPress={handleStart} />
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
  footer: {
    paddingVertical: spacing.lg,
  },
});
