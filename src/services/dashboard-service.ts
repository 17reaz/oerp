import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/candidate";
import type {
  DashboardAgent,
  DashboardData,
} from "@/types/dashboard";

const CANDIDATE_SELECT = `
  id,
  sl,
  name,
  passport_no,
  country,
  agent_id,
  current_stage,
  final_status,
  workflow_state,
  is_returned,
  agent:agents!candidates_agent_id_fkey (
    id,
    name,
    code
  )
`;

export async function getDashboardData(): Promise<DashboardData> {
  const [
    candidateCountResult,
    visaCountResult,
    recentCandidatesResult,
    agentsResult,
    countriesResult,
  ] = await Promise.all([
    supabase
      .from("candidates")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("is_deleted", false)
      .eq("is_returned", false)
      .is("final_status", null),

    supabase
      .from("visas")
      .select("id", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("candidates")
      .select(CANDIDATE_SELECT)
      .eq("is_deleted", false)
      .eq("is_returned", false)
      .is("final_status", null)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("agents")
      .select("id, name, code, sl")
      .eq("is_deleted", false)
      .eq("is_active", true)
      .order("name", {
        ascending: true,
      }),

    supabase
      .from("candidates")
      .select("country")
      .eq("is_deleted", false)
      .eq("is_returned", false)
      .is("final_status", null)
      .not("country", "is", null),
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

  if (agentsResult.error) {
    throw agentsResult.error;
  }

  if (countriesResult.error) {
    throw countriesResult.error;
  }

  const countries = Array.from(
    new Set(
      (countriesResult.data ?? [])
        .map((item) => item.country)
        .filter(
          (country): country is string =>
            typeof country === "string" && country.length > 0,
        ),
    ),
  ).sort();

  const recentCandidates: Candidate[] = (
    recentCandidatesResult.data ?? []
  ).map((candidate) => ({
    ...candidate,
    agent: Array.isArray(candidate.agent)
      ? candidate.agent[0] ?? null
      : candidate.agent,
  })) as Candidate[];

  return {
    activeCandidates: candidateCountResult.count ?? 0,
    visaProcessing: visaCountResult.count ?? 0,

    agentCount: agentsResult.data?.length ?? 0,

    countryCount: countries.length,

    agents: (agentsResult.data ?? []) as DashboardAgent[],

    countries,

    recentCandidates,
  };
}