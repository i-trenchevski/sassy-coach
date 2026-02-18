import { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Goal } from "@sassy-coach/shared";
import { MissionCard } from "@/components/MissionCard";
import { StreakBadge } from "@/components/StreakBadge";
import { CompletionOverlay } from "@/components/CompletionOverlay";
import { MilestoneBanner } from "@/components/MilestoneBanner";
import { GoalSelector } from "@/components/GoalSelector";
import { Button } from "@/components/Button";
import { useUser } from "@/hooks/useUser";
import { useMissions } from "@/hooks/useMissions";
import { computeStreak, getMilestone } from "@/utils/streak";
import { getToday } from "@/utils/dates";
import { colors, spacing, typography } from "@/constants/theme";

export default function HomeScreen() {
  const { user, loading: userLoading, updateUser } = useUser();
  const {
    todayMission,
    loading: missionsLoading,
    generateTodayMission,
    completeMission,
  } = useMissions();

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneCount, setMilestoneCount] = useState<number>(0);

  const loading = userLoading || missionsLoading;

  const handleGenerateMission = useCallback(async () => {
    if (!user || !selectedGoal) return;
    await generateTodayMission(user.id, selectedGoal, user.tone);
  }, [user, selectedGoal, generateTodayMission]);

  const handleComplete = useCallback(async () => {
    if (!user) return;

    const { newStreak } = computeStreak(
      user.lastCompletedDate,
      user.streakCount
    );
    const milestone = getMilestone(newStreak);

    await completeMission(reflectionText || null);
    await updateUser({
      streakCount: newStreak,
      lastCompletedDate: getToday(),
    });

    setShowOverlay(true);

    if (milestone) {
      setMilestoneCount(milestone);
      setShowMilestone(true);
    }
  }, [user, reflectionText, completeMission, updateUser]);

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const needsGoalPick = !todayMission;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Sassy Coach</Text>
        <StreakBadge count={user.streakCount} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {needsGoalPick ? (
          <>
            <Text style={styles.pickTitle}>What's today's focus?</Text>
            <Text style={styles.pickSubtitle}>
              Pick a goal for today's mission
            </Text>
            <View style={styles.goalPicker}>
              <GoalSelector
                selected={selectedGoal ?? user.goal}
                onSelect={setSelectedGoal}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Generate Mission"
                onPress={handleGenerateMission}
                disabled={!selectedGoal && !user.goal}
              />
            </View>
          </>
        ) : (
          <>
            <MissionCard
              mission={todayMission}
              completed={todayMission.completed}
              reflectionValue={
                todayMission.completed
                  ? todayMission.reflectionAnswer ?? ""
                  : reflectionText
              }
              onReflectionChange={setReflectionText}
            />

            {!todayMission.completed && (
              <View style={styles.buttonContainer}>
                <Button title="Complete Mission ✓" onPress={handleComplete} />
              </View>
            )}

            {todayMission.completed && (
              <View style={styles.doneContainer}>
                <Text style={styles.doneText}>
                  You're done for today. See you tomorrow! 💤
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <CompletionOverlay
        visible={showOverlay}
        onDismiss={() => setShowOverlay(false)}
        streakCount={user.streakCount}
      />

      {showMilestone && (
        <MilestoneBanner
          streakCount={milestoneCount}
          onDismiss={() => setShowMilestone(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  appName: {
    ...typography.heading,
    fontSize: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  pickTitle: {
    ...typography.heading,
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  pickSubtitle: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  goalPicker: {
    marginBottom: spacing.sm,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  doneContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  doneText: {
    ...typography.body,
    textAlign: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...typography.body,
  },
});
