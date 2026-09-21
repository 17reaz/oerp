import { supabase } from "@/lib/supabase";
import type {
  Candidate,
  CandidateDetail,
  CandidateImage,
} from "@/types/candidate";

// Temporary dummy image (no storage bucket yet).
const DUMMY_IMAGES: CandidateImage[] = [
  {
    key: "passport",
    label: "Passport",
    url: "https://placehold.co/600x800.png?text=Passport",
  },
];

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

export async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from("candidates")
    .select(CANDIDATE_SELECT)
    .eq("is_deleted", false)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to fetch candidates:", error);
    throw error;
  }

  return (data ?? []).map((candidate) => ({
    ...candidate,
    agent: Array.isArray(candidate.agent)
      ? candidate.agent[0] ?? null
      : candidate.agent ?? null,
  })) as Candidate[];
}

export async function getCandidateById(
  id: string,
): Promise<CandidateDetail | null> {
  const { data, error } = await supabase
    .from("candidates")
    .select(
      `
      ${CANDIDATE_SELECT},
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

export async function getCandidateImages(
  _id: string,
): Promise<CandidateImage[]> {
  return DUMMY_IMAGES;
}