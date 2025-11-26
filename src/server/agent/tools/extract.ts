import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { CardAnalysisResult, CardAnalysisError} from "@/types/cardResult";
import { buildPrompt } from "@/app/api/utils/helpers";
import { ExtractState, ExtractToolArgs } from "../types";

export const extract = {
  name: "extract",
  description: "Extract PSA label data from an NBA card image",

  // --- FIRMA CORRECTA PARA UNA TOOL DE AGENT ---
  execute: async (
    state: ExtractState,
    args: ExtractToolArgs
  ): Promise<ExtractState> => {
    try {
      const { imageBase64, file } = args;

      if (!imageBase64 || !file?.type) {
        return {
          ...state,
          extracted: {
            error: "invalid_args",
            reason: "Missing imageBase64 or file.type",
          } as CardAnalysisError,
        };
      }

      const model = openai("gpt-4.1-mini");

      const { text } = await generateText({
        model,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: buildPrompt() },
              {
                type: "image",
                image: `data:${file.type};base64,${imageBase64}`,
              },
            ],
          },
        ],
      });

      let parsed: CardAnalysisResult | CardAnalysisError;

      try {
        parsed = JSON.parse(text);
      } catch (parseErr) {
        parsed = {
          error: "invalid_json_response",
          reason: "Model returned non-JSON output",
        };
      }

      return {
        ...state,
        extracted: parsed,
      };
    } catch (err: any) {
      console.error("extract tool failed:", err);

      return {
        ...state,
        extracted: {
          error: "ai_client_failed",
          reason: String(err?.message ?? err),
        } as CardAnalysisError,
      };
    }
  },
};
