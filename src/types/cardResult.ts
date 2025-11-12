export interface CardAnalysisResult {
  playerName: string;
  team?: string;
  year?: string;
  cardNumber?: string;
  setName?: string;
  grade?: string;
  certificationNumber?: string;
  conditionDetails?: string;
  sport?: "Basketball" | "Other";
  issuer?: string;
  notes?: string;
}

export interface CardAnalysisError {
  error: string;
  reason: string;
}

// Response del service
export type CardAnalysisResponse =
  | { success: true; data: CardAnalysisResult }
  | { success: false; error: CardAnalysisError };