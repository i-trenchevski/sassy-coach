import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Haptics from "expo-haptics";
import { colors, spacing, borderRadius } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

interface CompletionOverlayProps {
  visible: boolean;
  onDismiss: () => void;
  streakCount: number;
}

export function CompletionOverlay({
  visible,
  onDismiss,
  streakCount,
}: CompletionOverlayProps) {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onDismiss}>
      <ConfettiCannon
        count={150}
        origin={{ x: width / 2, y: -20 }}
        fadeOut
        autoStart
      />
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Mission Complete!</Text>
        <Text style={styles.streak}>
          {streakCount === 1
            ? "Day 1 — the beginning of something great!"
            : `${streakCount} days in a row!`}
        </Text>
        <Text style={styles.tap}>Tap to continue</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13, 13, 13, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  content: {
    alignItems: "center",
    padding: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  streak: {
    fontSize: 18,
    color: colors.accentSecondary,
    fontWeight: "600",
    marginBottom: spacing.xl,
  },
  tap: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
