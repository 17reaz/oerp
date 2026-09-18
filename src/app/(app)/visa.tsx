import { StyleSheet, Text, View } from "react-native";

export default function VisaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visa</Text>

      <Text style={styles.subtitle}>
        Visa information will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
});