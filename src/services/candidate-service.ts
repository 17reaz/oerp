import { supabase } from "@/lib/supabase";
import type { Candidate, CandidateDetail,CandidateImage } from "@/types/candidate";
/**
 * ⚠️ Edit these two to match your database.
 *
 * IMAGE_BUCKET  -> Supabase Storage bucket name
 * IMAGE_FIELDS  -> columns in the `candidates` table that hold an image
 *                  (either a full https URL or a file path inside the bucket)
 */
const IMAGE_BUCKET = "candidates";

const IMAGE_FIELDS = [
  { column: "photo_url", label: "Photo" },
  { column: "passport_image_url", label: "Passport" },
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
async function resolveImageUrl(value: string): Promise<string | null> {
  // Already a full URL
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Otherwise treat it as a path inside the storage bucket.
  // Signed URLs work for both private and public buckets.
  const { data, error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .createSignedUrl(value, 60 * 60);

  if (error) {
    console.warn(`Could not sign image "${value}":`, error.message);
    return null;
  }

  return data.signedUrl;
}

/**
 * Never throws. Each column is fetched on its own, so a wrong column name
 * only hides that one image instead of breaking the whole page.
 */
export async function getCandidateImages(
  id: string,
): Promise<CandidateImage[]> {
  const results = await Promise.all(
    IMAGE_FIELDS.map(async ({ column, label }) => {
      const { data, error } = await supabase
        .from("candidates")
        .select(column)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.warn(`Image column "${column}" failed:`, error.message);
        return null;
      }

      const value = (data as unknown as Record<string, unknown> | null)?.[
        column
      ];

      if (typeof value !== "string" || !value.trim()) {
        return null;
      }

      const url = await resolveImageUrl(value.trim());

      return url ? { key: column, label, url } : null;
    }),
  );

  return results.filter(
    (item): item is CandidateImage => item !== null,
  );
}