import type { Candidate } from "@/types/candidate";

export type DashboardData = {
  activeCandidates: number;
  visaProcessing: number;
  recentCandidates: Candidate[];
};