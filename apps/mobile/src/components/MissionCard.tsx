import { View, Text, TextInput, StyleSheet } from "react-native";
import type { DailyMission } from "@sassy-coach/shared";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";

interface MissionCardProps {
  mission: DailyMission;
  completed: boolean;
  reflectionValue: string;
  onReflectionChange: (text: string) => void;
}

export function MissionCard({
  mission,
  completed,
  reflectionValue,
  onReflectionChange,
}: MissionCardProps) {
  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>YOUR MISSION</Text>
        <Text style={styles.task}>{mission.task}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sass}>{mission.sass}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>REFLECT</Text>
        <Text style={styles.reflection}>{mission.reflectionQuestion}</Text>
        <TextInput
          style={styles.input}
          placeholder="Your thoughts..."
          placeholderTextColor={colors.textMuted}
          value={reflectionValue}
          onChangeText={onReflectionChange}
          editable={!completed}
          multiline
          maxLength={200}
        />
      </View>

      {completed && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓ COMPLETED</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  section: {
    paddingVertical: spacing.sm,
  },
  sectionLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  task: {
    ...typography.subheading,
    fontSize: 22,
    lineHeight: 30,
  },
  sass: {
    ...typography.sass,
    fontSize: 15,
  },
  reflection: {
    ...typography.body,
    fontSize: 15,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: "top",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  completedBadge: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  completedText: {
    color: colors.success,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 1,
  },
});
