import { useCallback, useEffect, useMemo, useState } from "react";

import { getCandidates } from "@/services/candidate-service";
import { Candidate } from "@/types/candidate";

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

  // নাম বা পাসপোর্ট নম্বর দিয়ে filter — client-side, কারণ candidate list
  // এমনিতেই ছোট (কয়েকশো এর মধ্যে), আলাদা API call এর দরকার নেই
  const filteredCandidates = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return candidates;

    return candidates.filter((c) => {
      const name = c.name?.toLowerCase() ?? "";
      const passport = c.passport_no?.toLowerCase() ?? "";
      const stage = c.current_stage?.toLowerCase() ?? "";
      return (
        name.includes(query) ||
        passport.includes(query) ||
        stage.includes(query)
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