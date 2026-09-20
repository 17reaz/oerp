import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
// import { CandidateCard } from "../../features/candidates/components/candidate-card";
import { CandidateCard } from "../features/candidates/components/candidate-card";
import { useCandidates } from "../features/candidates/hooks/use-candidates";

export default function CandidatesScreen() {
  const {
    candidates,
    totalCount,
    loading,
    refreshing,
    error,
    refresh,
    searchQuery,
    setSearchQuery,
  } = useCandidates();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading candidates...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Unable to load candidates</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Candidates</Text>

        <Text style={styles.count}>
          {searchQuery
            ? `${candidates.length} of ${totalCount} candidates`
            : `${totalCount} candidates`}
        </Text>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, passport, stage..."
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.searchInput}
          />

          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color="#bbb" />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={candidates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CandidateCard
            candidate={item}
            onPress={() =>
              router.push({
                pathname: "/candidates/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={
          candidates.length === 0 ? styles.emptyContainer : styles.list
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={32} color="#ccc" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? "No matches found" : "No candidates"}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? `Nothing matches "${searchQuery}".`
                : "No candidates are available for your account."}
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
    backgroundColor: "#FAFAFA",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  count: {
    marginTop: 4,
    fontSize: 13,
    color: "#888",
  },

  searchBar: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F2F2F3",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    padding: 0,
  },

  list: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
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
    gap: 6,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },

  emptyText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
  },
});