import type { Candidate } from "@/types/candidate";

export type DashboardAgent = {
  id: string;
  name: string;
  code: string | null;
  sl: number | null;
};

export type DashboardData = {
  activeCandidates: number;
  visaProcessing: number;
  agentCount: number;
  countryCount: number;
  agents: DashboardAgent[];
  countries: string[];
  recentCandidates: Candidate[];
};