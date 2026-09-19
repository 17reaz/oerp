import { StyleSheet, Text, View } from "react-native";

type Props = {
  name: string;
  passportNumber: string;
  stage: string;
};

export function RecentCandidateCard({
  name,
  passportNumber,
  stage,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
<Text style={styles.passport} numberOfLines={1}>{passportNumber}</Text>
      </View>

      <View style={styles.stage}>
        <Text style={styles.stageText}>{stage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 70,
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

  stage: {
    maxWidth:"40%",
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