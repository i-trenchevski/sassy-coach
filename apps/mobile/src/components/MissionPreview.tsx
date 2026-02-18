import { View, Text, StyleSheet } from "react-native";
import type { DailyMission } from "@sassy-coach/shared";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";

interface MissionPreviewProps {
  mission: Pick<DailyMission, "task" | "sass" | "reflectionQuestion">;
}

export function MissionPreview({ mission }: MissionPreviewProps) {
  return (
    <View style={styles.card}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
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
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
