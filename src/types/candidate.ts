export type Candidate = {
  id: string;
  sl: number | null;
  name: string;
  passport_no: string | null;
  current_stage: string | null;
  final_status: "complete" | "cancelled" | null;
  workflow_state: "processing" | "hold" | null;
  is_returned: boolean;
};
export type CandidateVisa = {
  id: string;
  visa_no: string | null;
  visa_date: string | null;
  expiry_date: string | null;
  visa_type: string | null;
  status: string | null;
};

export type CandidateDetail = Candidate & {
  visas: CandidateVisa[];
};
export type CandidateImage = {
  key: string;
  label: string;
  url: string;
};