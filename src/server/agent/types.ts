import { CardAnalysisError, CardAnalysisResult } from "@/types/cardResult";

export type ExtractionOutput = CardAnalysisResult | CardAnalysisError;

export interface AgentState {
  file?: File | null;                // o Buffer en el server
  imageBase64?: string | null;
  extracted?: ExtractionOutput | null;
  certified?: { valid: boolean; info?: any } | null;
  description?: string | null;
  textEmbedding?: any | null;
  imageEmbedding?: any | null;
  persistResult?: any | null;
  errors?: string[];
}

export interface OrchestratorState {
  imageBase64?: string;
  file?: FileInfo;

  extracted?: CardAnalysisResult | CardAnalysisError;
  certified?: { is_psa: boolean; confidence: number } | CardAnalysisError;

  upserted?: {
    success: boolean;
    id?: string;
    reason?: string;
  };
}


export interface ExtractToolArgs {
  imageBase64: string;
  file: FileInfo;
}

export interface FileInfo {
  type: string;        // e.g. "image/jpeg"
  name?: string;       // optional
}

export interface ExtractState {
  extracted?: CardAnalysisResult | CardAnalysisError;
  [key: string]: any;
}

