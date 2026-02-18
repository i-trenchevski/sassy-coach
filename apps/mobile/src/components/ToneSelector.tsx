import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Tone } from "@sassy-coach/shared";
import { colors, spacing, borderRadius, typography } from "@/constants/theme";

interface ToneSelectorProps {
  selected: Tone | null;
  onSelect: (tone: Tone) => void;
}

const tones: { value: Tone; label: string; emoji: string; quote: string }[] = [
  {
    value: "sassy",
    label: "Sassy",
    emoji: "💅",
    quote: "Oh, you thought you could skip today? Cute.",
  },
  {
    value: "kind",
    label: "Kind",
    emoji: "🤗",
    quote: "You've got this. I believe in you.",
  },
  {
    value: "drill-sergeant",
    label: "Drill Sergeant",
    emoji: "🫡",
    quote: "Drop and give me 20. No excuses.",
  },
  {
    value: "zen",
    label: "Zen",
    emoji: "🧘",
    quote: "The journey begins with a single step.",
  },
];

export function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <View style={styles.container}>
      {tones.map((tone) => (
        <Pressable
          key={tone.value}
          onPress={() => onSelect(tone.value)}
          style={[
            styles.card,
            selected === tone.value && styles.cardSelected,
          ]}
        >
          <Text style={styles.emoji}>{tone.emoji}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{tone.label}</Text>
            <Text style={styles.quote}>"{tone.quote}"</Text>
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
  quote: {
    ...typography.sass,
    fontSize: 13,
    marginTop: 2,
  },
});
