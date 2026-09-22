import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
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
  | "hold"
  | "returned"
  | "complete"
  | "cancelled";

const statusFilters: {
  key: StatusFilter;
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "hold", label: "Hold" },
  { key: "returned", label: "Returned" },
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
      if (statusFilter === "active") {
        return (
          candidate.workflow_state === "processing" &&
          !candidate.is_returned &&
          !candidate.final_status
        );
      }

      if (statusFilter === "hold") {
        return candidate.workflow_state === "hold";
      }

      if (statusFilter === "returned") {
        return candidate.is_returned;
      }

      const status =
        candidate.final_status?.toLowerCase() ?? "";

      return status === statusFilter;
    });
  }, [candidates, statusFilter]);

  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingIcon}>
          <ActivityIndicator
            size="small"
            color="#208AEF"
          />
        </View>

        <Text style={styles.loadingTitle}>
          Loading candidates
        </Text>

        <Text style={styles.loadingText}>
          Getting your candidate workspace ready...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Ionicons
            name="cloud-offline-outline"
            size={24}
            color="#D92D20"
          />
        </View>

        <Text style={styles.errorTitle}>
          Unable to load candidates
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <Pressable
          onPress={refresh}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="refresh-outline"
            size={17}
            color="#FFFFFF"
          />

          <Text style={styles.retryText}>
            Try again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            tintColor="#208AEF"
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.listContent,
          filteredCandidates.length === 0 &&
            styles.emptyListContent,
        ]}
        ListHeaderComponent={
          <>
            {/* Intro */}
            <View style={styles.intro}>
              <View>
                <Text style={styles.pageTitle}>
                  Candidates
                </Text>

                <Text style={styles.pageSubtitle}>
                  Manage your candidate workspace
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push("/candidates/add")
                }
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color="#FFFFFF"
                />

                <Text style={styles.addButtonText}>
                  Add
                </Text>
              </Pressable>
            </View>

            {/* Search */}
            <Pressable
              onPress={() =>
                router.push("/candidates/search")
              }
              style={({ pressed }) => [
                styles.searchBox,
                pressed && styles.searchPressed,
              ]}
            >
              <View style={styles.searchIcon}>
                <Ionicons
                  name="search-outline"
                  size={20}
                  color="#667085"
                />
              </View>

              <View style={styles.searchContent}>
                <Text style={styles.searchTitle}>
                  Search candidates
                </Text>

                <Text style={styles.searchSubtitle}>
                  Name, passport, SL or agent code
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#98A2B3"
              />
            </Pressable>

            {/* Status filters */}
            <View style={styles.filterSection}>
              <FlatList
                horizontal
                data={statusFilters}
                keyExtractor={(item) => item.key}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={
                  styles.filterContent
                }
                renderItem={({ item }) => {
                  const selected =
                    statusFilter === item.key;

                  return (
                    <Pressable
                      onPress={() =>
                        setStatusFilter(item.key)
                      }
                      style={({ pressed }) => [
                        styles.filterChip,
                        selected &&
                          styles.filterChipSelected,
                        pressed && styles.pressed,
                      ]}
                    >
                      {item.key === "active" && (
                        <View
                          style={[
                            styles.filterDot,
                            selected &&
                              styles.filterDotSelected,
                          ]}
                        />
                      )}

                      <Text
                        style={[
                          styles.filterText,
                          selected &&
                            styles.filterTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            </View>

            {/* Result toolbar */}
            <View style={styles.resultToolbar}>
              <View>
                <Text style={styles.resultCount}>
                  {filteredCandidates.length}
                </Text>

                <Text style={styles.resultLabel}>
                  {filteredCandidates.length === 1
                    ? "candidate"
                    : "candidates"}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push("/candidates/search")
                }
                style={({ pressed }) => [
                  styles.filterButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="options-outline"
                  size={17}
                  color="#344054"
                />

                <Text style={styles.filterButtonText}>
                  Filter
                </Text>
              </Pressable>
            </View>

            {statusFilter !== "all" && (
              <View style={styles.activeFilterRow}>
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>
                    {statusFilters.find(
                      (item) =>
                        item.key === statusFilter
                    )?.label}
                  </Text>

                  <Pressable
                    onPress={() =>
                      setStatusFilter("all")
                    }
                    hitSlop={8}
                  >
                    <Ionicons
                      name="close"
                      size={14}
                      color="#1674CF"
                    />
                  </Pressable>
                </View>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="people-outline"
                size={28}
                color="#98A2B3"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No candidates found
            </Text>

            <Text style={styles.emptyText}>
              {statusFilter === "all"
                ? "There are no candidates available for your account yet."
                : "No candidates match this status."}
            </Text>

            {statusFilter !== "all" && (
              <Pressable
                onPress={() =>
                  setStatusFilter("all")
                }
                style={({ pressed }) => [
                  styles.clearButton,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.clearButtonText}>
                  Clear filter
                </Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 32,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  intro: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  pageTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.4,
  },

  pageSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#98A2B3",
  },

  addButton: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#208AEF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    shadowColor: "#208AEF",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  addButtonText: {
    fontSize: 13,
    fontWeight: "750",
    color: "#FFFFFF",
  },

  searchBox: {
    minHeight: 68,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "center",
  },

  searchPressed: {
    backgroundColor: "#F9FAFB",
    opacity: 0.85,
  },

  searchIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#F2F4F7",
    alignItems: "center",
    justifyContent: "center",
  },

  searchContent: {
    flex: 1,
    marginLeft: 11,
  },

  searchTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#344054",
  },

  searchSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#98A2B3",
  },

  filterSection: {
    marginTop: 16,
    marginHorizontal: -16,
  },

  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },

  filterChip: {
    height: 36,
    paddingHorizontal: 15,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  filterChipSelected: {
    backgroundColor: "#208AEF",
    borderColor: "#208AEF",
  },

  filterText: {
    fontSize: 12,
    fontWeight: "650",
    color: "#667085",
  },

  filterTextSelected: {
    color: "#FFFFFF",
  },

  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },

  filterDotSelected: {
    backgroundColor: "#FFFFFF",
  },

  resultToolbar: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resultCount: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "800",
    color: "#111827",
  },

  resultLabel: {
    marginTop: 1,
    fontSize: 11,
    color: "#98A2B3",
  },

  filterButton: {
    height: 36,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  filterButtonText: {
    fontSize: 12,
    fontWeight: "650",
    color: "#344054",
  },

  activeFilterRow: {
    marginBottom: 10,
  },

  activeFilter: {
    alignSelf: "flex-start",
    height: 30,
    paddingHorizontal: 9,
    borderRadius: 9,
    backgroundColor: "#EAF4FF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  activeFilterText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1674CF",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "#F8FAFC",
  },

  loadingIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#EAF4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "700",
    color: "#344054",
  },

  loadingText: {
    marginTop: 5,
    fontSize: 12,
    color: "#98A2B3",
    textAlign: "center",
  },

  errorIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#FEF3F2",
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: "750",
    color: "#344054",
  },

  errorText: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    color: "#98A2B3",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 18,
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#208AEF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  retryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  empty: {
    flex: 1,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "750",
    color: "#344054",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: "#98A2B3",
    textAlign: "center",
  },

  clearButton: {
    marginTop: 16,
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#EAF4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  clearButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1674CF",
  },

  pressed: {
    opacity: 0.65,
  },
});