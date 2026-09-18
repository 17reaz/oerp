import { StyleSheet, Text, View } from "react-native";

type Props = {
  email?: string | null;
};

export function DashboardHeader({ email }: Props) {
  const name = email?.split("@")[0] || "User";

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome back</Text>

      <Text style={styles.name}>
        {name}
      </Text>

      <Text style={styles.subtitle}>
        Here's what's happening today.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
    color: "#666",
  },

  name: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
  },
});