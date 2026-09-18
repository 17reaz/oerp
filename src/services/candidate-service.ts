import { supabase } from "@/lib/supabase";
import type { Candidate } from "@/types/candidate";

export async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from("candidates")
    .select(
      "id, sl, name, passport_no, current_stage, final_status, workflow_state, is_returned",
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to fetch candidates:", error);
    throw error;
  }

  return (data ?? []) as Candidate[];
}