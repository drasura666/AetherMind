// src/lib/auto-model-selector.ts

/**
 * Auto-selects the most suitable model for a given prompt,
 * restricted to the currently chosen provider only.
 */

import { AI_PROVIDERS } from "@/lib/ai-providers";

export function autoSelectModel(provider: string, prompt: string): string {
  const lower = prompt.toLowerCase();
  const available = AI_PROVIDERS[provider]?.models || [];

  if (available.length === 0) return "";

  // === STEM & Analytical Tasks ===
  if (lower.match(/math|physics|engineering|solve|calculate|problem|formula/)) {
    return available.find(m => m.includes("70b") || m.includes("120b") || m.includes("pro")) 
      || available[0];
  }

  // === Programming & Debugging ===
  if (lower.match(/code|debug|python|javascript|error|program/)) {
    return available.find(m => m.includes("120b") || m.includes("70b") || m.includes("command-r-plus")) 
      || available[0];
  }

  // === Research & Academic ===
  if (lower.match(/research|paper|analyze|report|summarize|study/)) {
    return available.find(m => m.includes("70b") || m.includes("pro") || m.includes("opus")) 
      || available[0];
  }

  // === Creative Tasks ===
  if (lower.match(/story|poem|art|creative|imagine|design/)) {
    return available.find(m => m.includes("gemini") || m.includes("mistral") || m.includes("command-r")) 
      || available[0];
  }

  // === General Chat or Fallback ===
  return available.find(m => m.includes("8b") || m.includes("flash") || m.includes("instant"))
    || available[0];
}
