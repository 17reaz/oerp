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