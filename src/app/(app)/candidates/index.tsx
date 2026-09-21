import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMemo, useState } from "react";

import { CandidateCard } from "../../features/candidates/components/candidate-card";
import { useCandidates } from "../../features/candidates/hooks/use-candidates";

type StatusFilter =
  | "all"
  | "active"
  | "returned"
  | "complete"
  | "hold"
  | "cancelled";

const statusFilters: {
  key: StatusFilter;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "hold", label: "Hold" },
  { key: "returned", label: "Returned" },
  { key: "complete", label: "Complete" },
  { key: "cancelled", label: "Cancelled" },
];

export default function CandidatesScreen() {
  const {
    candidates,
    loading,
    refreshing,
    error,
    refresh,
  } = useCandidates();

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const filteredCandidates = useMemo(() => {
    if (statusFilter === "all") {
      return candidates;
    }

    return candidates.filter((candidate) => {
      const status =
        candidate.final_status?.toLowerCase?.() ?? "";

      return status === statusFilter;
    });
  }, [candidates, statusFilter]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />

        <Text style={styles.loadingText}>
          Loading candidates...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load candidates
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Quick Filters */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {statusFilters.map((filter) => {
            const selected =
              statusFilter === filter.key;

            return (
              <Pressable
                key={filter.key}
                onPress={() =>
                  setStatusFilter(filter.key)
                }
                style={({ pressed }) => [
                  styles.filterChip,
                  selected && styles.filterChipSelected,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selected &&
                      styles.filterChipTextSelected,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Candidate Count */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          {filteredCandidates.length} candidates
        </Text>

        {statusFilter !== "all" && (
          <Pressable
            onPress={() => setStatusFilter("all")}
            hitSlop={8}
          >
            <Text style={styles.clearText}>
              Clear
            </Text>
          </Pressable>
        )}
      </View>

      {/* Candidate List */}
      <FlatList
        data={filteredCandidates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CandidateCard
            candidate={item}
            onPress={() =>
              router.push({
                pathname: "/candidates/[id]",
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        contentContainerStyle={
          filteredCandidates.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No candidates
            </Text>

            <Text style={styles.emptyText}>
              No candidates match the selected filter.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  filterWrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },

  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },

  filterChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f3f3",
  },

  filterChipSelected: {
    backgroundColor: "#111",
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },

  filterChipTextSelected: {
    color: "#fff",
  },

  countRow: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  countText: {
    fontSize: 13,
    color: "#777",
  },

  clearText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },

  pressed: {
    opacity: 0.7,
  },

  list: {
    paddingBottom: 24,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  errorText: {
    marginTop: 8,
    textAlign: "center",
    color: "#777",
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  empty: {
    alignItems: "center",
    padding: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  emptyText: {
    marginTop: 8,
    textAlign: "center",
    color: "#777",
  },
});