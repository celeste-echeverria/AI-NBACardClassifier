import { createAgent } from "ai";
import { aiClient } from "@/app/lib/aiClient";

import { extract } from "./tools/extract";
import { tool_certify } from "./tools/certify";
import { upsertCard } from "./tools/store";

import type { OrchestratorState } from "./types";
import { openai } from "@ai-sdk/openai";

export const orchestratorAgent = createAgent({
  client: aiClient,                     // OBLIGATORIO
  model: openai("gpt-4.1-mini"),

  tools: {
    extract,
    tool_certify,
    upsertCard,
  },

  initialState: {
    extracted: undefined,
    certified: undefined,
    upserted: undefined,
  } satisfies OrchestratorState,

  // LÓGICA PRINCIPAL DEL ORQUESTADOR
  async onStep({ state, tools }) {
    // 1) EXTRACT → si aún no se extrajo
    if (!state.extracted) {
      const result = await tools.extract();
      return {
        ...state,
        extracted: result,
      };
    }

    // 2) CERTIFY → si ya extrajimos pero aún no certificamos
    if (!state.certified) {
      const result = await tools.certify({
        extracted: state.extracted,
      });
      return {
        ...state,
        certified: result,
      };
    }

    // 3) UPSERT → guardar embeddings en Pinecone
    if (!state.upserted) {
      const result = await tools.upsertCard({
        extracted: state.extracted,
      });
      return {
        ...state,
        upserted: result,
      };
    }

    // 4) Finalizado
    return state;
  },
});
