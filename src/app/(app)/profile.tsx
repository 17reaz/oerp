import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "@/src/features/auth/auth-provider";

export default function ProfileScreen() {
  const { session, signOut } = useAuth();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to logout.";

      Alert.alert("Logout failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.email}>
        {session?.user.email ?? "No email"}
      </Text>

      <Pressable
        onPress={handleLogout}
        disabled={loading}
        style={styles.logout}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.logoutText}>Logout</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
  },

  email: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },

  logout: {
    marginTop: 32,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});