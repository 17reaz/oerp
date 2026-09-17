import { View, Text, StyleSheet, Pressable } from "react-native";
import { Candidate } from "../types/candidate";

type Props = {
  candidate: Candidate;
  onPress: () => void;
};

export default function CandidateCard({
  candidate,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {candidate.name.charAt(0)}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>
            {candidate.name}
          </Text>

          <Text style={styles.passport}>
            {candidate.passportNo}
          </Text>
        </View>

        <View style={styles.stage}>
          <Text style={styles.stageText}>
            {candidate.stage}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <Text style={styles.country}>
          {candidate.country}
        </Text>

        <Text style={styles.date}>
          {candidate.receivedDate}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
  },

  pressed: {
    opacity: 0.7,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2563eb",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  passport: {
    marginTop: 3,
    fontSize: 13,
    color: "#6b7280",
  },

  stage: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  stageText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2563eb",
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  country: {
    fontSize: 13,
    color: "#374151",
  },

  date: {
    fontSize: 12,
    color: "#9ca3af",
  },
});