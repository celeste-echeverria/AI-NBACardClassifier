import { orchestratorAgent } from "./orchestrator";
import type { OrchestratorState } from "./types";

export async function runFullPipeline({
  imageBase64,
  file,
}: {
  imageBase64: string;
  file: { type: string; name?: string };
}) {
  let state: OrchestratorState = { imageBase64, file };

  // --- 1) EXTRACT ---
  const step1 = await orchestratorAgent.run({
    messages: [
      { role: "user", content: "Run extraction." }
    ],
    initialState: state,
    tool: { name: "extract", args: { imageBase64, file } }
  });

  state = step1.state;
  if ("error" in (state.extracted ?? {})) {
    return state; // → corte directo
  }

  // --- 2) CERTIFY ---
  const step2 = await orchestratorAgent.run({
    messages: [
      { role: "user", content: "Run certification." }
    ],
    initialState: state,
    tool: { name: "certify", args: { extracted: state.extracted } }
  });

  state = step2.state;
  if ("error" in (state.certified ?? {}) || !state.certified?.is_psa) {
    return state; // → corte
  }

  // --- 3) UPSERT ---
  const step3 = await orchestratorAgent.run({
    messages: [
      { role: "user", content: "Store card in Pinecone." }
    ],
    initialState: state,
    tool: { 
      name: "upsertCard", 
      args: { extracted: state.extracted } 
    }
  });

  state = step3.state;

  return state;
}
