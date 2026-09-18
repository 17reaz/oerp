import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../features/auth/auth-provider";

import { DashboardHeader } from "../features/dashboard/components/dashboard-header";
import { DashboardStatCard } from "../features/dashboard/components/dashboard-stat-card";
import { RecentCandidateCard } from "../features/dashboard/components/recent-candidate-card";

export default function DashboardScreen() {
  const { session } = useAuth();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <DashboardHeader email={session?.user.email} />

      <View style={styles.stats}>
        <DashboardStatCard
          title="Candidates"
          value="—"
          description="Total active candidates"
        />

        <DashboardStatCard
          title="Visa"
          value="—"
          description="Visa processing"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Recent Candidates
        </Text>

        <View style={styles.list}>
          <RecentCandidateCard
            name="Candidate"
            passportNumber="—"
            stage="—"
          />

          <RecentCandidateCard
            name="Candidate"
            passportNumber="—"
            stage="—"
          />

          <RecentCandidateCard
            name="Candidate"
            passportNumber="—"
            stage="—"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 32,
  },

  stats: {
    flexDirection: "row",
    gap: 12,
  },

  section: {
    marginTop: 32,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  list: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 14,
    overflow: "hidden",
  },
});