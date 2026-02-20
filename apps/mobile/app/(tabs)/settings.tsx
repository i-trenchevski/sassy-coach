import { useState, useCallback } from "react";
import { View, Text, Pressable, Alert, StyleSheet, ScrollView, Switch } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoalSelector } from "@/components/GoalSelector";
import { ToneSelector } from "@/components/ToneSelector";
import { Button } from "@/components/Button";
import { useUser } from "@/hooks/useUser";
import { useAuthContext } from "@/contexts/AuthContext";
import { clearAll, getNotificationPrefs, saveNotificationPrefs } from "@/utils/storage";
import { scheduleDailyReminder, cancelDailyReminder } from "@/utils/notifications";
import { api } from "@/utils/api";
import { colors, spacing, typography, borderRadius } from "@/constants/theme";
import type { Goal, Tone } from "@sassy-coach/shared";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, loading, reload, updateUser } = useUser();
  const { session, signOut } = useAuthContext();
  const [editingGoal, setEditingGoal] = useState(false);
  const [editingTone, setEditingTone] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifHour, setNotifHour] = useState(9);
  const [notifMinute, setNotifMinute] = useState(0);

  useFocusEffect(
    useCallback(() => {
      reload();
      getNotificationPrefs().then(({ enabled, hour, minute }) => {
        setNotifEnabled(enabled);
        setNotifHour(hour);
        setNotifMinute(minute);
      });
    }, [reload])
  );

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleGoalChange = (goal: Goal) => {
    updateUser({ goal });
    setEditingGoal(false);
  };

  const handleToneChange = (tone: Tone) => {
    updateUser({ tone });
    setEditingTone(false);
  };

  const handleNotifToggle = async (value: boolean) => {
    if (value) {
      const granted = await scheduleDailyReminder(notifHour, notifMinute);
      if (!granted) {
        Alert.alert(
          "Permission Denied",
          "Enable notifications in your device settings to receive daily reminders."
        );
        return;
      }
    } else {
      await cancelDailyReminder();
    }
    setNotifEnabled(value);
    await saveNotificationPrefs(value, notifHour, notifMinute);
  };

  const handleTimeChange = async (newHour: number, newMinute: number) => {
    setNotifHour(newHour);
    setNotifMinute(newMinute);
    await saveNotificationPrefs(notifEnabled, newHour, newMinute);
    if (notifEnabled) {
      await scheduleDailyReminder(newHour, newMinute);
    }
  };

  const handleReset = () => {
    Alert.alert(
      "Reset All Data",
      "This will clear your streak, history, and preferences. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            // Reset on the server first (wipes DB streak + missions)
            try {
              await api.resetUser();
            } catch {
              // API unreachable — proceed with local reset anyway
            }
            await clearAll();
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          style={styles.row}
          onPress={() => setEditingGoal(!editingGoal)}
        >
          <Text style={styles.rowLabel}>Your Goal</Text>
          <Text style={styles.rowValue}>
            {user.goal} {editingGoal ? "▲" : "▼"}
          </Text>
        </Pressable>

        {editingGoal && (
          <View style={styles.selectorContainer}>
            <GoalSelector selected={user.goal} onSelect={handleGoalChange} />
          </View>
        )}

        <Pressable
          style={styles.row}
          onPress={() => setEditingTone(!editingTone)}
        >
          <Text style={styles.rowLabel}>Coach Tone</Text>
          <Text style={styles.rowValue}>
            {user.tone} {editingTone ? "▲" : "▼"}
          </Text>
        </Pressable>

        {editingTone && (
          <View style={styles.selectorContainer}>
            <ToneSelector selected={user.tone} onSelect={handleToneChange} />
          </View>
        )}

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Stats</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>🔥 {user.streakCount}</Text>
          </View>
        </View>

        <View style={styles.accountSection}>
          <Text style={styles.statsTitle}>Account</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Email</Text>
            <Text style={styles.statValue}>
              {session?.user?.email ?? "—"}
            </Text>
          </View>
        </View>

        <View style={styles.notifSection}>
          <Text style={styles.statsTitle}>Notifications</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Daily Reminder</Text>
            <Switch
              value={notifEnabled}
              onValueChange={handleNotifToggle}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.textPrimary}
            />
          </View>
          {notifEnabled && (
            <View style={[styles.statRow, styles.timeRow]}>
              <Text style={styles.statLabel}>Time</Text>
              <View style={styles.timePicker}>
                <Pressable
                  style={styles.timeBtn}
                  onPress={() => handleTimeChange((notifHour - 1 + 24) % 24, notifMinute)}
                >
                  <Text style={styles.timeBtnText}>−</Text>
                </Pressable>
                <Text style={styles.timeValue}>{String(notifHour).padStart(2, "0")}</Text>
                <Pressable
                  style={styles.timeBtn}
                  onPress={() => handleTimeChange((notifHour + 1) % 24, notifMinute)}
                >
                  <Text style={styles.timeBtnText}>+</Text>
                </Pressable>
                <Text style={styles.timeSep}>:</Text>
                <Pressable
                  style={styles.timeBtn}
                  onPress={() => handleTimeChange(notifHour, (notifMinute - 15 + 60) % 60)}
                >
                  <Text style={styles.timeBtnText}>−</Text>
                </Pressable>
                <Text style={styles.timeValue}>{String(notifMinute).padStart(2, "0")}</Text>
                <Pressable
                  style={styles.timeBtn}
                  onPress={() => handleTimeChange(notifHour, (notifMinute + 15) % 60)}
                >
                  <Text style={styles.timeBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View style={styles.resetSection}>
          <Button
            title="Reset All Data"
            onPress={handleReset}
            variant="secondary"
          />
        </View>

        <View style={styles.logoutSection}>
          <Button
            title="Log Out"
            onPress={() => {
              Alert.alert("Log Out", "Are you sure you want to log out?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log Out",
                  style: "destructive",
                  onPress: async () => {
                    await clearAll();
                    await signOut();
                    router.replace("/");
                  },
                },
              ]);
            }}
            variant="secondary"
          />
        </View>

        <Text style={styles.version}>Sassy Coach v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.heading,
    fontSize: 22,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  rowValue: {
    ...typography.body,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  selectorContainer: {
    marginBottom: spacing.md,
  },
  statsSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  statsTitle: {
    ...typography.subheading,
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    ...typography.body,
    fontSize: 14,
  },
  statValue: {
    ...typography.body,
    color: colors.accentSecondary,
    fontWeight: "600",
  },
  accountSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  notifSection: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  timeRow: {
    marginTop: spacing.xs,
  },
  timePicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeBtn: {
    width: 28,
    height: 28,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  timeBtnText: {
    color: colors.textPrimary,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "600",
  },
  timeValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  timeSep: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  resetSection: {
    marginTop: spacing.xl,
  },
  logoutSection: {
    marginTop: spacing.md,
  },
  version: {
    ...typography.caption,
    textAlign: "center",
    marginTop: spacing.xl,
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
