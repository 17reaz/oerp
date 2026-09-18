export type Visa = {
  id: string;
  candidate_id: string;
  sl: number | null;
  visa_no: string | null;
  visa_date: string | null;
  expiry_date: string | null;
  visa_type: string | null;
  status: string | null;

  candidate: {
    id: string;
    sl: number | null;
    name: string;
    passport_no: string | null;
  } | null;
};