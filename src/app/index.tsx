import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";

import { candidates } from "../data/candidates";
import CandidateCard from "../components/CandidateCard";

export default function Dashboard() {
  const router = useRouter();

  const totalCandidates = candidates.length;

  const medical = candidates.filter(
    (item) => item.stage === "MEDICAL"
  ).length;

  const visa = candidates.filter(
    (item) => item.stage === "VISA"
  ).length;

  const manpower = candidates.filter(
    (item) => item.stage === "MANPOWER"
  ).length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>
              Welcome back
            </Text>

            <Text style={styles.title}>
              Manpower ERP
            </Text>
          </View>

          <Pressable style={styles.notification}>
            <Text style={styles.notificationText}>
              🔔
            </Text>
          </Pressable>
        </View>

        {/* Summary */}

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {totalCandidates}
            </Text>

            <Text style={styles.summaryLabel}>
              Candidates
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {medical}
            </Text>

            <Text style={styles.summaryLabel}>
              Medical
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {visa}
            </Text>

            <Text style={styles.summaryLabel}>
              Visa
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>
              {manpower}
            </Text>

            <Text style={styles.summaryLabel}>
              Manpower
            </Text>
          </View>
        </View>

        {/* Candidates header */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Candidates
          </Text>

          <Pressable
            onPress={() => router.push("/candidates")}
          >
            <Text style={styles.viewAll}>
              View all
            </Text>
          </Pressable>
        </View>

        {/* Candidates */}

        {candidates.slice(0, 3).map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            onPress={() =>
              router.push(`/candidate/${candidate.id}`)
            }
          />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.activeNavText}>
            Home
          </Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push("/candidates")}
        >
          <Text style={styles.navIcon}>♙</Text>
          <Text style={styles.navText}>
            Candidates
          </Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <Text style={styles.navIcon}>⚙</Text>
          <Text style={styles.navText}>
            Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  smallText: {
    fontSize: 13,
    color: "#64748b",
  },

  title: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
  },

  notification: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  notificationText: {
    fontSize: 18,
  },

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  summaryCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  summaryNumber: {
    fontSize: 25,
    fontWeight: "800",
    color: "#0f172a",
  },

  summaryLabel: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },

  viewAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2563eb",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 21,
    color: "#64748b",
  },

  navText: {
    marginTop: 3,
    fontSize: 11,
    color: "#64748b",
  },

  activeNavText: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "700",
    color: "#2563eb",
  },
});