import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Goal } from "@sassy-coach/shared";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";

interface GoalSelectorProps {
  selected: Goal | null;
  onSelect: (goal: Goal) => void;
}

const goals: { value: Goal; label: string; emoji: string; description: string }[] = [
  { value: "fitness", label: "Fitness", emoji: "💪", description: "Get moving, get strong" },
  { value: "productivity", label: "Productivity", emoji: "🚀", description: "Crush your to-do list" },
  { value: "language", label: "Language", emoji: "🌍", description: "Learn something new" },
  { value: "job-search", label: "Job Search", emoji: "💼", description: "Land that dream job" },
  { value: "custom", label: "Custom", emoji: "✨", description: "Something else entirely" },
];

export function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <View style={styles.container}>
      {goals.map((goal) => (
        <Pressable
          key={goal.value}
          onPress={() => onSelect(goal.value)}
          style={[
            styles.card,
            selected === goal.value && styles.cardSelected,
          ]}
        >
          <Text style={styles.emoji}>{goal.emoji}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{goal.label}</Text>
            <Text style={styles.description}>{goal.description}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  cardSelected: {
    borderColor: colors.accent,
  },
  emoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...typography.subheading,
    fontSize: 17,
  },
  description: {
    ...typography.caption,
    marginTop: 2,
  },
});
