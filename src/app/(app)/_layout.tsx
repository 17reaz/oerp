import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { AppHeader } from "../components/app-header";
import { useAuth } from "../features/auth/auth-provider";

export default function AppLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#208AEF" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,

        header: ({ options }) => (
          <AppHeader
            title={
              typeof options.title === "string"
                ? options.title
                : "OERP"
            }
          />
        ),

        tabBarActiveTintColor: "#208AEF",
        tabBarInactiveTintColor: "#98A2B3",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 1,
        },

        tabBarItemStyle: {
          paddingTop: 5,
        },

        tabBarStyle: {
          height: 68,
          paddingTop: 3,
          paddingBottom: 8,

          backgroundColor: "#FFFFFF",

          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#E5E7EB",

          elevation: 8,

          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 10,
          shadowOffset: {
            width: 0,
            height: -3,
          },
        },
      }}
    >
      {/* Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabIcon,
                focused && styles.tabIconActive,
              ]}
            >
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Candidates */}
      <Tabs.Screen
        name="candidates"
        options={{
          title: "Candidates",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabIcon,
                focused && styles.tabIconActive,
              ]}
            >
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Visa */}
      <Tabs.Screen
        name="visa"
        options={{
          title: "Visa",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabIcon,
                focused && styles.tabIconActive,
              ]}
            >
              <Ionicons
                name={
                  focused
                    ? "document-text"
                    : "document-text-outline"
                }
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.tabIcon,
                focused && styles.tabIconActive,
              ]}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={20}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  tabIcon: {
    width: 40,
    height: 28,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 14,
  },

  tabIconActive: {
    backgroundColor: "#EAF4FF",
  },
});