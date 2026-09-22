import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Candidate } from "@/types/candidate";
import { getInitials, getStatusColor } from "../utils";

type Props = {
  candidate: Candidate;
  onPress?: () => void;
};

export function CandidateCard({ candidate, onPress }: Props) {
  const stage = candidate.current_stage || "—";
  const stageColor = getStatusColor(candidate.current_stage);

  const agentName = candidate.agent?.name || "No agent";
  const country = candidate.country || "No country";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${candidate.name}, ${agentName}, ${country}, stage ${stage}`}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {getInitials(candidate.name)}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {candidate.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.sl}>
            SL {candidate.sl ?? "—"}
          </Text>

          <View style={styles.dot} />

          <Text style={styles.passport} numberOfLines={1}>
            {candidate.passport_no || "No passport number"}
          </Text>
        </View>

        <View style={styles.agentCountryRow}>
          <Text style={styles.agent} numberOfLines={1}>
            {agentName}
          </Text>

          <View style={styles.dot} />

          <Text style={styles.country} numberOfLines={1}>
            {country}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.stage,
          {
            backgroundColor: stageColor.bg,
          },
        ]}
      >
        <Text
          style={[
            styles.stageText,
            {
              color: stageColor.text,
            },
          ]}
          numberOfLines={1}
        >
          {stage}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },

  pressed: {
    backgroundColor: "#FAFAFA",
    opacity: 0.9,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#208AEF",
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
  },

  metaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  agentCountryRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  sl: {
    fontSize: 12,
    color: "#999",
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },

  passport: {
    flexShrink: 1,
    fontSize: 12,
    color: "#999",
  },

  agent: {
    flexShrink: 1,
    maxWidth: "55%",
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },

  country: {
    flexShrink: 1,
    maxWidth: "35%",
    fontSize: 12,
    color: "#888",
  },

  stage: {
    maxWidth: "30%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  stageText: {
    fontSize: 11,
    fontWeight: "700",
  },
});