// src/server/agent/tools/certify.ts
import axios from "axios";
import { AgentState } from "../types";

export async function tool_certify(state: AgentState) {
  const serial = (state.extracted && !("error" in state.extracted)) ? state.extracted.serial_number : null;
  if (!serial) {
    state.certified = { valid: false, info: "no_serial" };
    return { state, valid: false };
  }

  try {
    const res = await axios.get(`https://www.psacard.com/cert/${encodeURIComponent(serial)}`);

    const valid = res.status === 200 && typeof res.data === "object";
    state.certified = { valid, info: res.data };
    return { state, valid, info: res.data };
  } catch (err) {
    state.certified = { valid: false, info: "psa_check_failed" };
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { state, valid: false, info: errorMessage };
  }
}
