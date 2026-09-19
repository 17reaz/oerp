import { useCallback, useEffect, useState } from "react";

import {
  getCandidateById,
  getCandidateImages,
} from "@/services/candidate-service";
import type { CandidateDetail, CandidateImage } from "@/types/candidate";

export function useCandidate(id: string | undefined) {
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [images, setImages] = useState<CandidateImage[]>([]);
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

      const [data, nextImages] = await Promise.all([
        getCandidateById(id),
        getCandidateImages(id),
      ]);

      setCandidate(data);
      setImages(nextImages);
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
    images,
    loading,
    refreshing,
    error,
    refresh,
  };
}