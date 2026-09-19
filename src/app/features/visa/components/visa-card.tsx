import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Visa } from "@/types/visa";

type Props = {
  visa: Visa;
  onPress?: () => void;
};

export function VisaCard({ visa, onPress }: Props) {
  const candidate = visa.candidate;
  const status = visa.status || "—";

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${candidate?.name ?? "Unknown candidate"}, visa ${status}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.info}>
        <Text style={styles.sl}>SL: {candidate?.sl ?? "—"}</Text>

        <Text style={styles.name} numberOfLines={1}>
          {candidate?.name ?? "Unknown candidate"}
        </Text>

        <Text style={styles.passport} numberOfLines={1} selectable>
          {candidate?.passport_no || "No passport number"}
        </Text>

        {visa.visa_no ? (
          <Text style={styles.visaNo} numberOfLines={1} selectable>
            Visa No: {visa.visa_no}
          </Text>
        ) : null}

        {visa.visa_date ? (
          <Text style={styles.date}>Visa Date: {visa.visa_date}</Text>
        ) : null}
      </View>

      <View style={styles.status}>
        <Text style={styles.statusText} numberOfLines={1}>
          {status}
        </Text>
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  pressed: { backgroundColor: "#f7f7f7" },
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

  sl: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
  },

  name: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: "600",
  },

  passport: {
    marginTop: 5,
    fontSize: 12,
    color: "#777",
  },

  visaNo: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },

  date: {
    marginTop: 3,
    fontSize: 12,
    color: "#777",
  },

  status: {
    maxWidth:"40%",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f2f2f2",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
});