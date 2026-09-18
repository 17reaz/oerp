import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../features/auth/auth-provider";

import { DashboardHeader } from "../features/dashboard/components/dashboard-header";
import { DashboardStatCard } from "../features/dashboard/components/dashboard-stat-card";
import { RecentCandidateCard } from "../features/dashboard/components/recent-candidate-card";
import { useDashboard } from "../features/dashboard/hooks/use-dashboard";

export default function DashboardScreen() {
  const { session } = useAuth();

  const {
    activeCandidates,
    visaProcessing,
    recentCandidates,
    loading,
    refreshing,
    error,
    refresh,
  } = useDashboard();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load dashboard
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
        />
      }
    >
      <DashboardHeader
        email={session?.user.email}
      />

      {/* Stats */}
      <View style={styles.stats}>
        <DashboardStatCard
          title="Candidates"
          value={activeCandidates}
          description="Total active candidates"
        />

        <DashboardStatCard
          title="Visa"
          value={visaProcessing}
          description="Visa processing"
        />
      </View>

      {/* Recent Candidates */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Candidates
          </Text>

          <Text style={styles.count}>
            {recentCandidates.length}
          </Text>
        </View>

        <View style={styles.list}>
          {recentCandidates.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                No candidates
              </Text>

              <Text style={styles.emptyText}>
                No active candidates are available.
              </Text>
            </View>
          ) : (
            recentCandidates.map((candidate) => (
              <RecentCandidateCard
                key={candidate.id}
                name={candidate.name}
                passportNumber={
                  candidate.passport_no || "No passport number"
                }
                stage={
                  candidate.current_stage || "—"
                }
              />
            ))
          )}
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

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  count: {
    fontSize: 12,
    fontWeight: "600",
    color: "#777",
  },

  list: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 14,
    overflow: "hidden",
  },

  empty: {
    padding: 24,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
    textAlign: "center",
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
    color: "#777",
    textAlign: "center",
  },
});