import { supabase } from "@/lib/supabase";
import type {
  Candidate,
  CandidateDetail,
  CandidateImage,
} from "@/types/candidate";

const PASSPORTS_BUCKET = "passports";

// Matches: ...-{docType}-v{version}.{ext}  e.g. "1-riajul-islam-A12345678-passport-v2.jpeg"
const FILE_PATTERN = /-([a-z0-9]+)-v(\d+)\.([a-z0-9]+)$/i;

function labelFor(docType: string): string {
  return docType.charAt(0).toUpperCase() + docType.slice(1);
}

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

export type CreateCandidateInput = {
  name: string;
  passport_no: string;
  country: string;
  received_date?: string | null;
  agent_id?: string | null;
  nationality?: string | null;
  profession?: string | null;
  date_of_birth?: string | null;
  address?: string | null;
  phone?: string | null;
  requested_services?: Record<string, boolean>;
};

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

export async function checkPassportDuplicate(
  passportNo: string,
): Promise<boolean> {
  const normalizedPassport = passportNo.trim().toUpperCase();

  if (!normalizedPassport) {
    return false;
  }

  const { data, error } = await supabase
    .from("candidates")
    .select("id")
    .eq("passport_no", normalizedPassport)
    .eq("is_deleted", false)
    .limit(1);

  if (error) {
    console.error("Failed to check passport:", error);
    throw error;
  }

  return (data?.length ?? 0) > 0;
}

export async function createCandidate(
  input: CreateCandidateInput,
): Promise<Candidate> {
  const name = input.name.trim();
  const passportNo = input.passport_no.trim().toUpperCase();
  const country = input.country.trim();

  if (!name) {
    throw new Error("Candidate name is required.");
  }

  if (!passportNo) {
    throw new Error("Passport number is required.");
  }

  if (!country) {
    throw new Error("Country is required.");
  }

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  const user = userData.user;

  if (!user) {
    throw new Error("You must be logged in to add a candidate.");
  }

  const { data: tenantId, error: tenantError } =
    await supabase.rpc("get_my_tenant_id");

  if (tenantError) {
    console.error("Failed to resolve tenant:", tenantError);
    throw tenantError;
  }

  if (!tenantId) {
    throw new Error("Unable to resolve your organization.");
  }

  const duplicate = await checkPassportDuplicate(passportNo);

  if (duplicate) {
    throw new Error(
      `Passport ${passportNo} already exists.`,
    );
  }

  const payload = {
    tenant_id: tenantId,
    created_by: user.id,

    name,
    passport_no: passportNo,
    country,

    received_date: input.received_date || null,
    agent_id: input.agent_id || null,

    nationality: input.nationality?.trim() || null,
    profession: input.profession?.trim() || null,
    date_of_birth: input.date_of_birth || null,
    address: input.address?.trim() || null,
    phone: input.phone?.trim() || null,

    ...(input.requested_services
      ? {
          requested_services: input.requested_services,
        }
      : {}),

    // Same behavior as OverseasErp web.
    workflow_state: "hold",
    hold_reason: "received",
    workflow_updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("candidates")
    .insert(payload)
    .select(CANDIDATE_SELECT)
    .single();

  if (error) {
    console.error("Failed to create candidate:", error);
    throw error;
  }

  return {
    ...data,
    agent: Array.isArray(data.agent)
      ? data.agent[0] ?? null
      : data.agent ?? null,
  } as Candidate;
}

export async function getCandidateImages(
  id: string,
): Promise<CandidateImage[]> {
  const { data: tenantId, error: tenantError } =
    await supabase.rpc("get_my_tenant_id");

  if (tenantError || !tenantId) {
    console.error(
      "Failed to resolve tenant for candidate images:",
      tenantError,
    );
    return [];
  }

  const folder = `${tenantId}/${id}`;

  const { data: files, error: listError } = await supabase.storage
    .from(PASSPORTS_BUCKET)
    .list(folder, {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });

  if (listError) {
    console.error("Failed to list candidate documents:", listError);
    return [];
  }

  if (!files || files.length === 0) {
    return [];
  }

    // Keep only the highest version per document type (passport, visa, etc.)
  type LatestDoc = { fileName: string; version: number };
  const latestByType = new Map<string, LatestDoc>();
  for (const file of files) {
    const match = file.name.match(FILE_PATTERN);

    if (!match) {
      continue;
    }

    const [, docType, versionStr] = match;
    const version = Number(versionStr);
    const existing = latestByType.get(docType);

    if (!existing || version > existing.version) {
      latestByType.set(docType, {
        fileName: file.name,
        version,
      });
    }
  }

  const entries = Array.from(latestByType.entries());

  const signedUrls = await Promise.all(
    entries.map(([, { fileName }]) =>
      supabase.storage
        .from(PASSPORTS_BUCKET)
        .createSignedUrl(`${folder}/${fileName}`, 60 * 60),
    ),
  );

  const images: CandidateImage[] = [];

  entries.forEach(([docType], index) => {
    const signed = signedUrls[index];

    if (signed.error || !signed.data?.signedUrl) {
      console.error(
        `Failed to sign URL for ${docType}:`,
        signed.error,
      );
      return;
    }

    images.push({
      key: docType,
      label: labelFor(docType),
      url: signed.data.signedUrl,
    });
  });

  return images;
}