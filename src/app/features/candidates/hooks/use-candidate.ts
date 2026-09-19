import { useCallback, useEffect, useState } from "react";

import { getCandidateById } from "@/services/candidate-service";
import type { CandidateDetail } from "@/types/candidate";

export function useCandidate(id: string | undefined) {
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setError("Missing candidate id.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setError(null);

      const data = await getCandidateById(id);

      setCandidate(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load candidate.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    await load();
  }

  return {
    candidate,
    loading,
    refreshing,
    error,
    refresh,
  };
}