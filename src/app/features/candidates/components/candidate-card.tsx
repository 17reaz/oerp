import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Candidate } from "@/types/candidate";

type Props = {
  candidate: Candidate;
  onPress?: () => void;
};

export function CandidateCard({ candidate, onPress }: Props) {
  const stage = candidate.current_stage || "—";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${candidate.name}, stage ${stage}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.info}>
        <Text style={styles.sl}>SL: {candidate.sl ?? "—"}</Text>

        <Text style={styles.name} numberOfLines={1}>
          {candidate.name}
        </Text>

        <Text style={styles.passport} numberOfLines={1} selectable>
          {candidate.passport_no || "No passport number"}
        </Text>
      </View>

      <View style={styles.stage}>
        <Text style={styles.stageText} numberOfLines={1}>
          {stage}
        </Text>
      </View>
    </Pressable>
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
  pressed: { backgroundColor: "#f7f7f7" },
  info: { flex: 1, paddingRight: 12 },
  sl: { fontSize: 12, fontWeight: "700", color: "#555" },
  name: { marginTop: 3, fontSize: 15, fontWeight: "600" },
  passport: { marginTop: 5, fontSize: 12, color: "#777" },
  stage: {
    maxWidth: "40%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f2f2f2",
  },
  stageText: { fontSize: 11, fontWeight: "600" },
});
