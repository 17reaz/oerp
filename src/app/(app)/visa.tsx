import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { VisaCard } from "../features/visa/components/visa-card";
import { useVisa } from "../features/visa/hooks/use-visa";

export default function VisaScreen() {
  const {
    visas,
    loading,
    refreshing,
    error,
    refresh,
  } = useVisa();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />

        <Text style={styles.loadingText}>
          Loading visas...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load visas
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visa</Text>

        <Text style={styles.count}>
          {visas.length} visas
        </Text>
      </View>

      <FlatList
        data={visas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VisaCard visa={item} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
        contentContainerStyle={
          visas.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No visas
            </Text>

            <Text style={styles.emptyText}>
              No visa records are available for your account.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
  },

  count: {
    marginTop: 6,
    fontSize: 13,
    color: "#777",
  },

  list: {
    paddingBottom: 24,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  errorText: {
    marginTop: 8,
    textAlign: "center",
    color: "#777",
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  empty: {
    alignItems: "center",
    padding: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  emptyText: {
    marginTop: 8,
    textAlign: "center",
    color: "#777",
  },
});