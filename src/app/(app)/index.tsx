import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { DashboardHeader } from "../features/dashboard/components/dashboard-header";
import { RecentCandidateCard } from "../features/dashboard/components/recent-candidate-card";
import { useDashboard } from "../features/dashboard/hooks/use-dashboard";
import { useAuth } from "../features/auth/auth-provider";

export default function DashboardScreen() {
  const router = useRouter();
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
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <View style={styles.stateIcon}>
          <Ionicons
            name="cloud-offline-outline"
            size={25}
            color="#667085"
          />
        </View>

        <Text style={styles.stateTitle}>
          Unable to load dashboard
        </Text>

        <Text style={styles.stateText}>
          {error}
        </Text>

        <Pressable
          onPress={refresh}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="refresh-outline" size={17} color="#FFFFFF" />
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const firstName =
    session?.user?.user_metadata?.full_name?.split(" ")[0] ||
    session?.user?.email?.split("@")[0] ||
    "there";

  return (
    <View style={styles.container}>
      <FlatList
        data={recentCandidates}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#208AEF"
          />
        }
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            {/* Hero */}
            <View style={styles.hero}>
              <View style={styles.heroContent}>
                <Text style={styles.eyebrow}>OERP WORKSPACE</Text>

                <Text style={styles.greeting}>
                  Good to see you, {firstName}
                </Text>

                <Text style={styles.heroSubtitle}>
                  Keep your candidate processing on track.
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push("/(app)/profile" as never)
                }
                style={({ pressed }) => [
                  styles.avatar,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.avatarText}>
                  {firstName.charAt(0).toUpperCase()}
                </Text>
              </Pressable>
            </View>

            {/* Main KPIs */}
            <View style={styles.statsRow}>
              <DashboardKpi
                title="Candidates"
                value={activeCandidates}
                caption="Active"
                icon="people-outline"
                onPress={() =>
                  router.push("/(app)/candidates" as never)
                }
              />

              <DashboardKpi
                title="Visa"
                value={visaProcessing}
                caption="Processing"
                icon="document-text-outline"
                onPress={() =>
                  router.push("/(app)/visa" as never)
                }
              />
            </View>

            {/* Workspace shortcut */}
            <Pressable
              onPress={() =>
                router.push("/(app)/candidates" as never)
              }
              style={({ pressed }) => [
                styles.workspaceCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.workspaceIcon}>
                <Ionicons
                  name="pulse-outline"
                  size={22}
                  color="#208AEF"
                />
              </View>

              <View style={styles.workspaceBody}>
                <Text style={styles.workspaceTitle}>
                  Candidate workspace
                </Text>

                <Text style={styles.workspaceText}>
                  Search candidates, check their stage and continue
                  processing.
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color="#98A2B3"
              />
            </Pressable>

            {/* Secondary stats */}
            <View style={styles.secondaryRow}>
              <MiniStat
                icon="briefcase-outline"
                value={agentCount}
                label="Active agents"
              />

              <MiniStat
                icon="globe-outline"
                value={countryCount}
                label="Destinations"
              />
            </View>

            {/* Recent */}
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Recent candidates
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Latest candidate activity
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  router.push("/(app)/candidates" as never)
                }
                hitSlop={8}
              >
                <Text style={styles.viewAll}>View all</Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.recentItem}>
            <RecentCandidateCard
              name={item.name}
              passportNumber={
                item.passport_no || "No passport number"
              }
              stage={item.current_stage || "—"}
              agent={item.agent?.name}
              country={item.country}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="people-outline"
                size={25}
                color="#98A2B3"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No recent candidates
            </Text>

            <Text style={styles.emptyText}>
              New candidate activity will appear here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* KPI                                                                          */
/* -------------------------------------------------------------------------- */

function DashboardKpi({
  title,
  value,
  caption,
  icon,
  onPress,
}: {
  title: string;
  value: number;
  caption: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.kpiCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.kpiTop}>
        <View style={styles.kpiIcon}>
          <Ionicons name={icon} size={20} color="#208AEF" />
        </View>

        <Ionicons
          name="arrow-up-right"
          size={17}
          color="#98A2B3"
        />
      </View>

      <Text style={styles.kpiValue}>{value}</Text>

      <Text style={styles.kpiTitle}>{title}</Text>

      <Text style={styles.kpiCaption}>{caption}</Text>
    </Pressable>
  );
}

/* -------------------------------------------------------------------------- */
/* Mini stats                                                                   */
/* -------------------------------------------------------------------------- */

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
}) {
  return (
    <View style={styles.miniStat}>
      <View style={styles.miniIcon}>
        <Ionicons name={icon} size={18} color="#667085" />
      </View>

      <View style={styles.miniContent}>
        <Text style={styles.miniValue}>{value}</Text>
        <Text style={styles.miniLabel}>{label}</Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                      */
/* -------------------------------------------------------------------------- */

function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonHero}>
          <View style={styles.skeletonEyebrow} />
          <View style={styles.skeletonGreeting} />
          <View style={styles.skeletonSubtitle} />
        </View>

        <View style={styles.skeletonAvatar} />

        <View style={styles.statsRow}>
          <View style={styles.skeletonKpi} />
          <View style={styles.skeletonKpi} />
        </View>

        <View style={styles.skeletonWorkspace} />

        <View style={styles.secondaryRow}>
          <View style={styles.skeletonMini} />
          <View style={styles.skeletonMini} />
        </View>

        <View style={styles.skeletonSectionTitle} />
        <View style={styles.skeletonRecent} />
        <View style={styles.skeletonRecent} />
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                       */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 32,
  },

  /* Hero */

  hero: {
    minHeight: 100,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  heroContent: {
    flex: 1,
    paddingRight: 12,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#208AEF",
    marginBottom: 6,
  },

  greeting: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    color: "#111827",
  },

  heroSubtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: "#667085",
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF4FF",
    borderWidth: 1,
    borderColor: "#D5E9FF",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "800",
    color: "#208AEF",
  },

  /* KPI */

  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  kpiCard: {
    flex: 1,
    minHeight: 148,
    padding: 16,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7ECF2",
    shadowColor: "#101828",
    shadowOpacity: 0.035,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 1,
  },

  kpiTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  kpiIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF4FF",
  },

  kpiValue: {
    marginTop: 14,
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "800",
    color: "#111827",
  },

  kpiTitle: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "700",
    color: "#344054",
  },

  kpiCaption: {
    marginTop: 2,
    fontSize: 11,
    color: "#98A2B3",
  },

  /* Workspace */

  workspaceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7ECF2",
    marginBottom: 12,
  },

  workspaceIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF4FF",
  },

  workspaceBody: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  workspaceTitle: {
    fontSize: 14,
    fontWeight: "750",
    color: "#111827",
  },

  workspaceText: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: "#667085",
  },

  /* Secondary stats */

  secondaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 26,
  },

  miniStat: {
    flex: 1,
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7ECF2",
  },

  miniIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  },

  miniContent: {
    marginLeft: 9,
  },

  miniValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },

  miniLabel: {
    marginTop: 1,
    fontSize: 10,
    color: "#667085",
  },

  /* Section */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: "#98A2B3",
  },

  viewAll: {
    fontSize: 12,
    fontWeight: "700",
    color: "#208AEF",
    paddingBottom: 1,
  },

  recentItem: {
    marginBottom: 10,
  },

  /* Empty */

  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7ECF2",
  },

  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  },

  emptyTitle: {
    marginTop: 11,
    fontSize: 14,
    fontWeight: "700",
    color: "#344054",
  },

  emptyText: {
    marginTop: 4,
    fontSize: 12,
    color: "#98A2B3",
    textAlign: "center",
  },

  /* States */

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },

  stateIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  },

  stateTitle: {
    marginTop: 14,
    fontSize: 17,
    fontWeight: "750",
    color: "#111827",
  },

  stateText: {
    marginTop: 6,
    maxWidth: 300,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    color: "#667085",
  },

  retryButton: {
    minHeight: 44,
    marginTop: 18,
    paddingHorizontal: 17,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#208AEF",
  },

  retryText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  pressed: {
    opacity: 0.72,
  },

  /* Skeleton */

  skeletonContent: {
    paddingHorizontal: 16,
    paddingTop: 22,
  },

  skeletonHero: {
    paddingTop: 8,
  },

  skeletonEyebrow: {
    width: 90,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E4E7EC",
  },

  skeletonGreeting: {
    width: "68%",
    height: 27,
    marginTop: 9,
    borderRadius: 7,
    backgroundColor: "#E4E7EC",
  },

  skeletonSubtitle: {
    width: "78%",
    height: 13,
    marginTop: 8,
    borderRadius: 6,
    backgroundColor: "#E4E7EC",
  },

  skeletonAvatar: {
    position: "absolute",
    top: 22,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E4E7EC",
  },

  skeletonKpi: {
    flex: 1,
    height: 148,
    borderRadius: 17,
    backgroundColor: "#E4E7EC",
  },

  skeletonWorkspace: {
    height: 82,
    borderRadius: 17,
    marginBottom: 12,
    backgroundColor: "#E4E7EC",
  },

  skeletonMini: {
    flex: 1,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#E4E7EC",
  },

  skeletonSectionTitle: {
    width: 150,
    height: 20,
    marginBottom: 12,
    borderRadius: 6,
    backgroundColor: "#E4E7EC",
  },

  skeletonRecent: {
    height: 96,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: "#E4E7EC",
  },
});