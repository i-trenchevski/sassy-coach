import { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { HistoryItem } from "@/components/HistoryItem";
import { useMissions } from "@/hooks/useMissions";
import { colors, spacing, typography } from "@/constants/theme";

export default function HistoryScreen() {
  const { missions, loading, reload } = useMissions();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  }, [reload]);

  const sortedMissions = [...missions].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.emptyText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
      </View>

      {sortedMissions.length === 0 ? (
        <FlatList
          data={[]}
          renderItem={() => null}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.center}
          ListEmptyComponent={
            <>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>
                Complete your first mission to start building history.
              </Text>
            </>
          }
        />
      ) : (
        <FlatList
          data={sortedMissions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <HistoryItem
              mission={item}
              expanded={expandedId === item.id}
              onToggle={() =>
                setExpandedId((prev) => (prev === item.id ? null : item.id))
              }
            />
          )}
        />
      )}
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
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    textAlign: "center",
  },
});
