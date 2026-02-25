import { View, Text, Pressable, StyleSheet } from "react-native";
import type { DailyMission } from "@sassy-coach/shared";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";
import { formatDate } from "@/utils/dates";

interface HistoryItemProps {
  mission: DailyMission;
  expanded: boolean;
  onToggle: () => void;
}

export function HistoryItem({ mission, expanded, onToggle }: HistoryItemProps) {
  return (
    <Pressable onPress={onToggle} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.status}>
            {mission.completed ? "✓" : "✗"}
          </Text>
          <View style={styles.taskContainer}>
            <Text style={styles.date}>{formatDate(mission.date)}</Text>
            <Text style={styles.taskPreview}>{mission.task}</Text>
          </View>
        </View>
        <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
      </View>

      {expanded && (
        <View style={styles.details}>
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>MISSION</Text>
            <Text style={styles.detailText}>{mission.task}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>SASS</Text>
            <Text style={styles.sassText}>{mission.sass}</Text>
          </View>
          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>REFLECTION</Text>
            <Text style={styles.detailText}>{mission.reflectionQuestion}</Text>
            {mission.reflectionAnswer && (
              <Text style={styles.answerText}>
                → {mission.reflectionAnswer}
              </Text>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
  },
  taskContainer: {
    flex: 1,
  },
  status: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.success,
    width: 24,
    textAlign: "center",
  },
  date: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  taskPreview: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 12,
    color: colors.textMuted,
  },
  details: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  detailSection: {},
  detailLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.body,
    fontSize: 14,
  },
  sassText: {
    ...typography.sass,
    fontSize: 14,
  },
  answerText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
});
