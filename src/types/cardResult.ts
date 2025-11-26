export interface CardAnalysisResult {
  player_name: string;
  team: string;
  year: number;
  card_brand: string;
  card_number: string | null;
  grade: string;
  psa_label_color: string;
  serial_number: string | null;
  parallel: string | null;
}

export interface CardAnalysisError {
  error: string;
  reason: string;
}

// Response del service
export type CardAnalysisResponse =
  | { success: true; data: CardAnalysisResult }
  | { success: false; error: CardAnalysisError };