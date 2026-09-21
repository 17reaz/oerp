import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { CandidateCard } from "../../features/candidates/components/candidate-card";
import { useCandidates } from "../../features/candidates/hooks/use-candidates";

export default function CandidateSearchScreen() {
  const {
    candidates,
    loading,
    error,
    searchQuery,
    setSearchQuery,
  } = useCandidates();

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </Pressable>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={19} color="#888" />

          <TextInput
            ref={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search candidate..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={styles.searchInput}
          />

          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={19}
                color="#aaa"
              />
            </Pressable>
          )}
        </View>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />

          <Text style={styles.loadingText}>
            Loading candidates...
          </Text>
        </View>
      ) : error ? (
        /* Error */
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Unable to search candidates
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : (
        <>
          {/* Result Header */}
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>
              {searchQuery.trim()
                ? "Search results"
                : "All candidates"}
            </Text>

            <Text style={styles.resultCount}>
              {candidates.length}
            </Text>
          </View>

          {/* Results */}
          <FlatList
            data={candidates}
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
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              candidates.length === 0
                ? styles.emptyContainer
                : styles.list
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Ionicons
                  name="search-outline"
                  size={36}
                  color="#ccc"
                />

                <Text style={styles.emptyTitle}>
                  {searchQuery.trim()
                    ? "No matches found"
                    : "No candidates"}
                </Text>

                <Text style={styles.emptyText}>
                  {searchQuery.trim()
                    ? `Nothing matches "${searchQuery.trim()}".`
                    : "No candidates are available for your account."}
                </Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  header: {
    paddingTop: 58,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backButton: {
    width: 40,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  searchBar: {
    flex: 1,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F2F2F3",
    borderRadius: 12,
    paddingHorizontal: 13,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111",
    padding: 0,
  },

  resultHeader: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  resultTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },

  resultCount: {
    fontSize: 13,
    color: "#888",
  },

  list: {
    padding: 16,
    paddingTop: 8,
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
  },

  emptyTitle: {
    marginTop: 8,
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },

  emptyText: {
    marginTop: 7,
    textAlign: "center",
    color: "#888",
    fontSize: 13,
    lineHeight: 19,
  },
});