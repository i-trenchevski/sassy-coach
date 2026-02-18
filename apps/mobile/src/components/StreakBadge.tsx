import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";

interface StreakBadgeProps {
  count: number;
}

export function StreakBadge({ count }: StreakBadgeProps) {
  if (count === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Start your streak!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  flame: {
    fontSize: 20,
  },
  count: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accentSecondary,
  },
  label: {
    ...typography.caption,
    fontSize: 14,
  },
});
