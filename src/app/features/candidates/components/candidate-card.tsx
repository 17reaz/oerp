import { StyleSheet, Text, View } from "react-native";

import type { Candidate } from "@/types/candidate";

type Props = {
  candidate: Candidate;
};

export function CandidateCard({ candidate }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>
          {candidate.name}
        </Text>

        <Text style={styles.passport}>
          {candidate.passport_no || "No passport number"}
        </Text>
      </View>

      <View style={styles.stage}>
        <Text style={styles.stageText}>
          {candidate.current_stage || "—"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  info: {
    flex: 1,
    paddingRight: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  passport: {
    marginTop: 5,
    fontSize: 12,
    color: "#777",
  },

  stage: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f2f2f2",
  },

  stageText: {
    fontSize: 11,
    fontWeight: "600",
  },
});