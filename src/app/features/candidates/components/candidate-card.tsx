import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Candidate } from "@/types/candidate";

type Props = {
  candidate: Candidate;
  onPress?: () => void;
};

// নাম থেকে initials বের করে avatar-এ দেখানোর জন্য
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
}

// স্টেজ অনুযায়ী রং — status একনজরে বোঝার জন্য
function getStageColor(stage: string | null): { bg: string; text: string } {
  const s = (stage || "").toLowerCase();
  if (s.includes("complete") || s.includes("approved")) {
    return { bg: "#E7F7EE", text: "#1A9A5B" };
  }
  if (s.includes("hold") || s.includes("cancel")) {
    return { bg: "#FDECEC", text: "#D3453B" };
  }
  if (s.includes("processing") || s.includes("progress")) {
    return { bg: "#FFF4E0", text: "#B7791F" };
  }
  return { bg: "#F2F2F3", text: "#555" };
}

export function CandidateCard({ candidate, onPress }: Props) {
  const stage = candidate.current_stage || "—";
  const stageColor = getStageColor(candidate.current_stage);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${candidate.name}, stage ${stage}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(candidate.name)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {candidate.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.sl}>SL {candidate.sl ?? "—"}</Text>
          <View style={styles.dot} />
          <Text style={styles.passport} numberOfLines={1}>
            {candidate.passport_no || "No passport number"}
          </Text>
        </View>
      </View>

      <View style={[styles.stage, { backgroundColor: stageColor.bg }]}>
        <Text
          style={[styles.stageText, { color: stageColor.text }]}
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
    shadowOffset: { width: 0, height: 1 },
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

  stage: {
    maxWidth: "35%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  stageText: {
    fontSize: 11,
    fontWeight: "700",
  },
});