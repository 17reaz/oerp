import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CandidateImages } from "../../features/candidates/components/candidate-images";
import { useCandidate } from "@/app/features/candidates/hooks/use-candidate";
import { getInitials, getStatusColor } from "@/app/features/candidates/utils";

function label(value: string | null | undefined) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Row({
  icon,
  title,
  value,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={15} color="#208AEF" />
        </View>

        <Text style={styles.rowTitle}>{title}</Text>
      </View>

      <Text style={styles.rowValue} selectable>
        {value}
      </Text>
    </View>
  );
}

export default function CandidateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { candidate, images, loading, refreshing, error, refresh } =
    useCandidate(id);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/candidates");
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={goBack}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={({ pressed }) => [
          styles.back,
          pressed && styles.backPressed,
        ]}
      >
        <Ionicons name="chevron-back" size={20} color="#111" />

        <Text style={styles.backText}>Candidates</Text>
      </Pressable>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />

          <Text style={styles.loadingText}>
            Loading candidate...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Unable to load candidate
          </Text>

          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : !candidate ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>
            Candidate not found
          </Text>

          <Text style={styles.errorText}>
            This candidate may have been removed or you don't have
            access.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
            />
          }
        >
          <View style={styles.hero}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(candidate.name)}
              </Text>
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.sl}>
                SL {candidate.sl ?? "—"}
              </Text>

              <Text style={styles.name} numberOfLines={2} selectable>
                {candidate.name}
              </Text>

              <Text style={styles.passportSubtitle} numberOfLines={1}>
                {candidate.passport_no || "No passport number"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.stage,
              { backgroundColor: getStatusColor(candidate.current_stage).bg },
            ]}
          >
            <Text
              style={[
                styles.stageText,
                { color: getStatusColor(candidate.current_stage).text },
              ]}
            >
              {candidate.current_stage || "—"}
            </Text>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.list}>
              <Row
                icon="document-text-outline"
                title="Passport No"
                value={candidate.passport_no || "—"}
              />
              <Row
                icon="flag-outline"
                title="Current Stage"
                value={candidate.current_stage || "—"}
              />
              <Row
                icon="git-branch-outline"
                title="Workflow"
                value={label(candidate.workflow_state)}
              />
              <Row
                icon="checkmark-done-outline"
                title="Final Status"
                value={label(candidate.final_status)}
              />
              <Row
                icon="return-down-back-outline"
                title="Returned"
                value={candidate.is_returned ? "Yes" : "No"}
                last
              />
            </View>
          </View>

          {/* Images */}
          <CandidateImages images={images} />

          {/* Visa */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Visa</Text>

              <Text style={styles.count}>
                {candidate.visas.length}
              </Text>
            </View>

            <View style={styles.list}>
              {candidate.visas.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyTitle}>No visa</Text>

                  <Text style={styles.emptyText}>
                    No visa record for this candidate.
                  </Text>
                </View>
              ) : (
                candidate.visas.map((visa, index) => {
                  const visaStatusColor = getStatusColor(visa.status);

                  return (
                    <View
                      key={visa.id}
                      style={[
                        styles.visaItem,
                        index === candidate.visas.length - 1 &&
                          styles.rowLast,
                      ]}
                    >
                      <View style={styles.visaIcon}>
                        <Ionicons
                          name="document-outline"
                          size={16}
                          color="#208AEF"
                        />
                      </View>

                      <View style={styles.visaInfo}>
                        <Text style={styles.visaNo} selectable>
                          {visa.visa_no || "No visa number"}
                        </Text>

                        {visa.visa_type ? (
                          <Text style={styles.visaMeta}>
                            Type: {visa.visa_type}
                          </Text>
                        ) : null}

                        {visa.visa_date ? (
                          <Text style={styles.visaMeta}>
                            Visa Date: {visa.visa_date}
                          </Text>
                        ) : null}

                        {visa.expiry_date ? (
                          <Text style={styles.visaMeta}>
                            Expiry: {visa.expiry_date}
                          </Text>
                        ) : null}
                      </View>

                      <View
                        style={[
                          styles.status,
                          { backgroundColor: visaStatusColor.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            { color: visaStatusColor.text },
                          ]}
                          numberOfLines={1}
                        >
                          {visa.status || "—"}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  back: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 64,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 14,
    borderRadius: 999,
  },

  backPressed: {
    backgroundColor: "#F2F2F3",
  },

  backText: {
    fontSize: 15,
    fontWeight: "500",
  },

  content: {
    padding: 24,
    paddingTop: 12,
    paddingBottom: 32,
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

  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#208AEF",
  },

  heroInfo: {
    flex: 1,
    minWidth: 0,
  },

  sl: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
  },

  name: {
    marginTop: 2,
    fontSize: 22,
    fontWeight: "700",
  },

  passportSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: "#777",
  },

  stage: {
    alignSelf: "flex-start",
    marginTop: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  stageText: {
    fontSize: 11,
    fontWeight: "700",
  },

  section: {
    marginTop: 32,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  count: {
    marginBottom: 12,
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

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  rowLast: {
    borderBottomWidth: 0,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  rowIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
  },

  rowTitle: {
    fontSize: 13,
    color: "#777",
  },

  rowValue: {
    flexShrink: 1,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
  },

  visaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  visaIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
  },

  visaInfo: {
    flex: 1,
    paddingRight: 12,
  },

  visaNo: {
    fontSize: 15,
    fontWeight: "600",
  },

  visaMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },

  status: {
    maxWidth: "40%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
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
});