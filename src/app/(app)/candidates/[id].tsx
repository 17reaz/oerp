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


function label(value: string | null | undefined) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Row({
  title,
  value,
  last,
}: {
  title: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowTitle}>{title}</Text>

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
        style={styles.back}
      >
        <Ionicons name="chevron-back" size={22} color="#111" />

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
          <Text style={styles.sl}>SL: {candidate.sl ?? "—"}</Text>

          <Text style={styles.name} selectable>
            {candidate.name}
          </Text>

          <View style={styles.stage}>
            <Text style={styles.stageText}>
              {candidate.current_stage || "—"}
            </Text>
          </View>

          {/* Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.list}>
              <Row
                title="Passport No"
                value={candidate.passport_no || "—"}
              />
              <Row
                title="Current Stage"
                value={candidate.current_stage || "—"}
              />
              <Row
                title="Workflow"
                value={label(candidate.workflow_state)}
              />
              <Row
                title="Final Status"
                value={label(candidate.final_status)}
              />
              <Row
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
                candidate.visas.map((visa, index) => (
                  <View
                    key={visa.id}
                    style={[
                      styles.visaItem,
                      index === candidate.visas.length - 1 &&
                        styles.rowLast,
                    ]}
                  >
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

                    <View style={styles.status}>
                      <Text
                        style={styles.statusText}
                        numberOfLines={1}
                      >
                        {visa.status || "—"}
                      </Text>
                    </View>
                  </View>
                ))
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
    paddingTop: 64,
    paddingHorizontal: 16,
    paddingBottom: 8,
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

  sl: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
  },

  name: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "700",
  },

  stage: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f2f2f2",
  },

  stageText: {
    fontSize: 11,
    fontWeight: "600",
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
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    backgroundColor: "#f2f2f2",
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