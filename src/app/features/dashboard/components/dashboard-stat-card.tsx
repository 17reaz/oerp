import { StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  value: string | number;
  description?: string;
};

export function DashboardStatCard({
  title,
  value,
  description,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>

      {description ? (
        <Text style={styles.description}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 120,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 14,
    color: "#666",
  },

  value: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: "700",
  },

  description: {
    marginTop: 4,
    fontSize: 12,
    color: "#888",
  },
});