import { useCallback, useEffect, useMemo, useState } from "react";

import { getCandidates } from "@/services/candidate-service";
import type { Candidate } from "@/types/candidate";

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredCandidates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      const name = candidate.name?.toLowerCase() ?? "";
      const passport = candidate.passport_no?.toLowerCase() ?? "";
      const stage = candidate.current_stage?.toLowerCase() ?? "";
      const country = candidate.country?.toLowerCase() ?? "";
      const agentName = candidate.agent?.name?.toLowerCase() ?? "";
      const agentCode = candidate.agent?.code?.toLowerCase() ?? "";

      return (
        name.includes(query) ||
        passport.includes(query) ||
        stage.includes(query) ||
        country.includes(query) ||
        agentName.includes(query) ||
        agentCode.includes(query)
      );
    });
  }, [candidates, searchQuery]);

  return {
    candidates: filteredCandidates,
    totalCount: candidates.length,
    loading,
    refreshing,
    error,
    refresh,
    searchQuery,
    setSearchQuery,
  };
}