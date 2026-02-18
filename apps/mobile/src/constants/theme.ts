export const colors = {
  background: "#0D0D0D",
  surface: "#1A1A2E",
  surfaceLight: "#252540",
  accent: "#E94560",
  accentSecondary: "#F5A623",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0B0",
  textMuted: "#606070",
  success: "#4ADE80",
  error: "#F87171",
  border: "#2A2A40",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  heading: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: colors.textPrimary,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    color: colors.textSecondary,
  },
  sass: {
    fontSize: 16,
    fontStyle: "italic" as const,
    color: colors.accent,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    color: colors.textMuted,
  },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
