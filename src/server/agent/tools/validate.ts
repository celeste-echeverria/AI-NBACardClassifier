// src/server/agent/tools/validate.ts
import { AgentState, ExtractionOutput } from "../types";

export async function tool_validate(state: AgentState) {
  const extracted = state.extracted as ExtractionOutput | null;
  if (!extracted) {
    state.errors = [...(state.errors||[]), "no_extraction"];
    return { state, ok: false, reason: "No extraction result" };
  }
  if ("error" in extracted) {
    state.errors = [...(state.errors||[]), extracted.reason];
    return { state, ok: false, reason: extracted.reason };
  }

  const ok = !!(extracted.psa_label_color && extracted.grade);
  if (!ok) {
    state.errors = [...(state.errors||[]), "not_psa_card"];
  }
  return { state, ok, reason: ok ? null : "not_psa_card" };
}
