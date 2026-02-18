import { useEffect, useRef } from "react";
import { Animated, Text, StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "@/constants/theme";

interface MilestoneBannerProps {
  streakCount: number;
  onDismiss: () => void;
}

const messages: Record<number, string> = {
  7: "One week! Your coach is impressed (barely). 🏆",
  30: "30 days?! You're basically unstoppable. 👑",
};

export function MilestoneBanner({
  streakCount,
  onDismiss,
}: MilestoneBannerProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const message = messages[streakCount];

  useEffect(() => {
    if (!message) return;

    Animated.sequence([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.delay(3500),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View
      style={[styles.banner, { transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 60,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.accentSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    zIndex: 50,
  },
  text: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },
});
