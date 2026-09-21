import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getDashboardData } from "@/services/dashboard-service";
import type { DashboardData } from "@/types/dashboard";

const INITIAL_DATA: DashboardData = {
  activeCandidates: 0,
  visaProcessing: 0,
  agentCount: 0,
  countryCount: 0,
  agents: [],
  countries: [],
  recentCandidates: [],
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(
    INITIAL_DATA,
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);

      const nextData = await getDashboardData();

      setData(nextData);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load dashboard.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    await load();
  }

  return {
    ...data,
    loading,
    refreshing,
    error,
    refresh,
  };
}