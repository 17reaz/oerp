import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { DashboardHeader } from "../features/dashboard/components/dashboard-header";
import { DashboardStatCard } from "../features/dashboard/components/dashboard-stat-card";
import { RecentCandidateCard } from "../features/dashboard/components/recent-candidate-card";
import { useDashboard } from "../features/dashboard/hooks/use-dashboard";
import { useAuth } from "../features/auth/auth-provider";

export default function DashboardScreen() {
  const { session } = useAuth();

  const {
    activeCandidates,
    visaProcessing,
    agentCount,
    countryCount,
    agents,
    countries,
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
    <View style={styles.container}>
      <FlatList
        data={recentCandidates}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <DashboardHeader
              email={session?.user?.email}
            />

            <View style={styles.statsRow}>
              <DashboardStatCard
                title="Candidates"
                value={activeCandidates}
                description="Active candidates"
              />

              <DashboardStatCard
                title="Visa"
                value={visaProcessing}
                description="Visa records"
              />
            </View>

            <View style={styles.statsRow}>
              <DashboardStatCard
                title="Agents"
                value={agentCount}
                description="Active agents"
              />

              <DashboardStatCard
                title="Countries"
                value={countryCount}
                description="Active destinations"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Agents
              </Text>

              {agents.length === 0 ? (
                <Text style={styles.emptyText}>
                  No active agents.
                </Text>
              ) : (
                <View style={styles.agentList}>
                  {agents.map((agent) => (
                    <View
                      key={agent.id}
                      style={styles.agentCard}
                    >
                      <View style={styles.agentAvatar}>
                        <Text style={styles.agentAvatarText}>
                          {agent.name
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.agentInfo}>
                        <Text
                          style={styles.agentName}
                          numberOfLines={1}
                        >
                          {agent.name}
                        </Text>

                        <Text style={styles.agentMeta}>
                          {agent.code || "No code"}
                          {" • "}
                          SL {agent.sl ?? "—"}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Countries
              </Text>

              {countries.length === 0 ? (
                <Text style={styles.emptyText}>
                  No countries found.
                </Text>
              ) : (
                <View style={styles.countryList}>
                  {countries.map((country) => (
                    <View
                      key={country}
                      style={styles.countryChip}
                    >
                      <Text style={styles.countryText}>
                        {country}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Recent Candidates
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <RecentCandidateCard
            name={item.name}
            passportNumber={
              item.passport_no || "No passport number"
            }
            stage={item.current_stage || "—"}
            agent={item.agent?.name}
            country={item.country}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No recent candidates.
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

  content: {
    padding: 20,
    paddingTop: 64,
    paddingBottom: 30,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  section: {
    marginTop: 22,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },

  agentList: {
    gap: 8,
  },

  agentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  agentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
  },

  agentAvatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#208AEF",
  },

  agentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  agentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },

  agentMeta: {
    marginTop: 3,
    fontSize: 12,
    color: "#888",
  },

  countryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  countryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  countryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555",
  },

  empty: {
    paddingVertical: 20,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 13,
    color: "#888",
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
});