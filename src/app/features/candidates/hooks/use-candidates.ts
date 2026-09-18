import { useCallback, useEffect, useState } from "react";

import { getCandidates } from "@/services/candidate-service";
import { Candidate } from "@/types/candidate";
export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);

      const data = await getCandidates();

      setCandidates(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load candidates.";

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
    candidates,
    loading,
    refreshing,
    error,
    refresh,
  };
}