export type CandidateStage =
  | "RECEIVED"
  | "MEDICAL"
  | "MOFA"
  | "FINGER"
  | "VISA"
  | "MANPOWER"
  | "FLIGHT"
  | "COMPLETED"
  | "RETURNED";

export type Candidate = {
  id: string;
  name: string;
  passportNo: string;
  country: string;
  agent: string;
  stage: CandidateStage;
  receivedDate: string;
};