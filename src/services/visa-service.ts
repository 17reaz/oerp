import { supabase } from "@/lib/supabase";
import type { Visa } from "@/types/visa";

export async function getVisas(): Promise<Visa[]> {
  const { data, error } = await supabase
    .from("visas")
    .select(`
      id,
      candidate_id,
      status,
      visa_date,
      visa_no,
      candidate:candidates (
        id,
        sl,
        name,
        passport_no
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to fetch visas:", error);
    throw error;
  }

  return (data ?? []) as Visa[];
}