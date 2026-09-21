import { StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  passportNumber: string;
  stage: string;
  agent?: string | null;
  country?: string | null;
};

export function RecentCandidateCard({
  name,
  passportNumber,
  stage,
  agent,
  country,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>

        <Text style={styles.passport} numberOfLines={1}>
          {passportNumber}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta} numberOfLines={1}>
            {agent || "No agent"}
          </Text>

          <View style={styles.dot} />

          <Text style={styles.meta} numberOfLines={1}>
            {country || "No country"}
          </Text>
        </View>
      </View>

      <View style={styles.stage}>
        <Text style={styles.stageText} numberOfLines={1}>
          {stage}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 82,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
  },

  passport: {
    marginTop: 4,
    fontSize: 12,
    color: "#777",
  },

  metaRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  meta: {
    flexShrink: 1,
    fontSize: 12,
    color: "#888",
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },

  stage: {
    maxWidth: "35%",
    marginLeft: 10,
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