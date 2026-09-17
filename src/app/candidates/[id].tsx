import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { candidates } from "../../data/candidates";

export default function CandidateDetails() {
  const router = useRouter();

  const { id } = useLocalSearchParams();

  const candidate = candidates.find(
    (item) => item.id === id
  );

  if (!candidate) {
    return (
      <View style={styles.container}>
        <Text>Candidate not found.</Text>
      </View>
    );
  }

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

        <Text style={styles.headerTitle}>
          Candidate Details
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {candidate.name.charAt(0)}
            </Text>
          </View>

          <Text style={styles.name}>
            {candidate.name}
          </Text>

          <Text style={styles.passport}>
            {candidate.passportNo}
          </Text>

          <View style={styles.stage}>
            <Text style={styles.stageText}>
              {candidate.stage}
            </Text>
          </View>
        </View>

        {/* Information */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Candidate Information
          </Text>

          <InfoRow
            label="Full Name"
            value={candidate.name}
          />

          <InfoRow
            label="Passport"
            value={candidate.passportNo}
          />

          <InfoRow
            label="Country"
            value={candidate.country}
          />

          <InfoRow
            label="Agent"
            value={candidate.agent}
          />

          <InfoRow
            label="Received Date"
            value={candidate.receivedDate}
          />

          <InfoRow
            label="Current Stage"
            value={candidate.stage}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
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
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#0f172a",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563eb",
  },

  name: {
    marginTop: 14,
    fontSize: 21,
    fontWeight: "800",
    color: "#0f172a",
  },

  passport: {
    marginTop: 5,
    fontSize: 14,
    color: "#64748b",
  },

  stage: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
  },

  stageText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563eb",
  },

  card: {
    marginTop: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },

  infoRow: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },

  label: {
    fontSize: 12,
    color: "#64748b",
  },

  value: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
});