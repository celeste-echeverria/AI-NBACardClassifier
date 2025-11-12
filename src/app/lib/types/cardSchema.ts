export interface CardInfo {
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
