import { supabase } from "@/lib/supabase";
import { Candidate } from "@/types/candidate";
export async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from("candidates")
    .select(
      "id, name, passport_no, current_stage, status",
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as Candidate[];
}