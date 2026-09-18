import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/candidate";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  const [
    candidateCountResult,
    visaCountResult,
    recentCandidatesResult,
  ] = await Promise.all([
    // Active candidates
    supabase
      .from("candidates")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("is_deleted", false)
      .eq("is_returned", false)
      .is("final_status", null),

    // Visa records
    supabase
      .from("visas")
      .select("id", {
        count: "exact",
        head: true,
      }),

    // Recent active candidates
    supabase
      .from("candidates")
      .select(
        "id, sl, name, passport_no, current_stage, final_status, workflow_state, is_returned",
      )
      .eq("is_deleted", false)
      .eq("is_returned", false)
      .is("final_status", null)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),
  ]);

  if (candidateCountResult.error) {
    throw candidateCountResult.error;
  }

  if (visaCountResult.error) {
    throw visaCountResult.error;
  }

  if (recentCandidatesResult.error) {
    throw recentCandidatesResult.error;
  }

  return {
    activeCandidates: candidateCountResult.count ?? 0,
    visaProcessing: visaCountResult.count ?? 0,
    recentCandidates:
      (recentCandidatesResult.data ?? []) as Candidate[],
  };
}