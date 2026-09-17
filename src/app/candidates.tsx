import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";

import { useState } from "react";
import { useRouter } from "expo-router";

import { candidates } from "../data/candidates";
import CandidateCard from "../components/CandidateCard";

export default function CandidatesScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const filteredCandidates = candidates.filter((candidate) => {
    const query = search.toLowerCase();

    return (
      candidate.name.toLowerCase().includes(query) ||
      candidate.passportNo.toLowerCase().includes(query) ||
      candidate.country.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <Text style={styles.title}>
          Candidates
        </Text>

        <Pressable style={styles.addButton}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>

      {/* Search */}

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search candidate..."
        placeholderTextColor="#94a3b8"
        style={styles.search}
      />

      {/* Count */}

      <Text style={styles.count}>
        {filteredCandidates.length} candidates
      </Text>

      {/* List */}

      <FlatList
        data={filteredCandidates}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CandidateCard
            candidate={item}
            onPress={() =>
              router.push(`/candidate/${item.id}`)
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 55,
  },

  header: {
    height: 55,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  backText: {
    fontSize: 30,
    color: "#0f172a",
    lineHeight: 34,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },

  addText: {
    fontSize: 25,
    color: "#ffffff",
    lineHeight: 28,
  },

  search: {
    marginHorizontal: 20,
    marginTop: 18,
    height: 48,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#0f172a",
  },

  count: {
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
    fontSize: 13,
    color: "#64748b",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
});