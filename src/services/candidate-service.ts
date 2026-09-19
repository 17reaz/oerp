import { supabase } from "@/lib/supabase";
import type {
  Candidate,
  CandidateDetail,
  CandidateImage,
} from "@/types/candidate";

// Temporary dummy image (no storage bucket yet).
// Replace `url` with any image link you like.
const DUMMY_IMAGES: CandidateImage[] = [
  {
    key: "passport",
    label: "Passport",
    url: "https://placehold.co/600x800.png?text=Passport",
  },
];

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

export async function getCandidateById(
  id: string,
): Promise<CandidateDetail | null> {
  const { data, error } = await supabase
    .from("candidates")
    .select(
      `
      id,
      sl,
      name,
      passport_no,
      current_stage,
      final_status,
      workflow_state,
      is_returned,
      visas (
        id,
        visa_no,
        visa_date,
        expiry_date,
        visa_type,
        status
      )
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch candidate:", error);
    throw error;
  }

  return (data ?? null) as CandidateDetail | null;
}

// Returns the same dummy image for every candidate for now.
export async function getCandidateImages(
  _id: string,
): Promise<CandidateImage[]> {
  return DUMMY_IMAGES;
}