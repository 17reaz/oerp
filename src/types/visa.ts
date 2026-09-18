export type Visa = {
  id: string;
  candidate_id: string;
  status: string | null;
  visa_date: string | null;
  visa_no: string | null;

  candidate: {
    id: string;
    sl: number | null;
    name: string;
    passport_no: string | null;
  } | null;
};