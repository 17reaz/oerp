import { supabase } from "@/lib/supabase";
import type { Visa } from "@/types/visa";

export async function getVisas(): Promise<Visa[]> {
  const { data, error } = await supabase
    .from("visas")
    .select(`
      id,
      candidate_id,
      sl,
      visa_no,
      visa_date,
      expiry_date,
      visa_type,
      status,
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

  return (data ?? []).map((row) => ({
    id: row.id,
    candidate_id: row.candidate_id,
    sl: row.sl,
    visa_no: row.visa_no,
    visa_date: row.visa_date,
    expiry_date: row.expiry_date,
    visa_type: row.visa_type,
    status: row.status,
    candidate: Array.isArray(row.candidate)
      ? row.candidate[0] ?? null
      : row.candidate ?? null,
  }));
}