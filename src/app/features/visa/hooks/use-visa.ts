import { useCallback, useEffect, useState } from "react";

import { getVisas } from "@/services/visa-service";
import type { Visa } from "@/types/visa";

export function useVisa() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);

      const data = await getVisas();

      setVisas(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load visas.";

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
    visas,
    loading,
    refreshing,
    error,
    refresh,
  };
}