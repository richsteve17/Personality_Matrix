import { SYSTEM_IDS, DIMENSION_NAMES } from "./prompts.js";

export function safeExtractJson(text) {
  if (typeof text !== "string") throw new Error("No text to parse");
  let s = text.trim();

  s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in response");
  }
  const candidate = s.slice(start, end + 1);
  try {
    return JSON.parse(candidate);
  } catch (e) {
    throw new Error(`JSON parse failed: ${e.message}`);
  }
}

function coerceRating(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const r = Math.round(n);
  if (r < 1 || r > 10) return null;
  return r;
}

export function validatePrimary(parsed) {
  if (!parsed || !Array.isArray(parsed.targets)) {
    throw new Error("Expected `targets` array");
  }
  const seen = new Set();
  const out = [];
  for (const t of parsed.targets) {
    if (!t || typeof t !== "object") continue;
    if (!SYSTEM_IDS.includes(t.id)) continue;
    if (seen.has(t.id)) continue;
    seen.add(t.id);
    const ratings = {};
    for (const dim of DIMENSION_NAMES) {
      const v = coerceRating(t.ratings?.[dim]);
      if (v !== null) ratings[dim] = v;
    }
    out.push({
      id: t.id,
      ratings,
      written: typeof t.written === "string" ? t.written.trim() : "",
      dinnerParty: typeof t.dinnerParty === "string" ? t.dinnerParty.trim() : "",
    });
  }
  if (out.length === 0) throw new Error("No valid targets extracted");
  return out;
}

export function validateFollowup(parsed) {
  if (!parsed || typeof parsed !== "object") throw new Error("Expected followup object");
  const rankings = parsed.rankings && typeof parsed.rankings === "object" ? parsed.rankings : {};
  const cleanRankings = {};
  for (const [dim, arr] of Object.entries(rankings)) {
    if (Array.isArray(arr)) {
      cleanRankings[dim] = arr.filter(id => SYSTEM_IDS.includes(id));
    }
  }
  return {
    rankings: cleanRankings,
    mostCharitable: SYSTEM_IDS.includes(parsed.mostCharitable) ? parsed.mostCharitable : null,
    mostHarsh: SYSTEM_IDS.includes(parsed.mostHarsh) ? parsed.mostHarsh : null,
    blindspots: typeof parsed.blindspots === "string" ? parsed.blindspots.trim() : "",
    strongestDisagreement: typeof parsed.strongestDisagreement === "string" ? parsed.strongestDisagreement.trim() : "",
  };
}

export function serializeFollowup(fu) {
  const lines = [];
  if (Object.keys(fu.rankings || {}).length) {
    lines.push("Force-Ranks (best → worst):");
    for (const [dim, ids] of Object.entries(fu.rankings)) {
      lines.push(`  ${dim}: ${ids.join(" > ")}`);
    }
  }
  if (fu.mostCharitable) lines.push(`Most charitable: ${fu.mostCharitable}`);
  if (fu.mostHarsh) lines.push(`Most harsh: ${fu.mostHarsh}`);
  if (fu.blindspots) lines.push(`Blindspots: ${fu.blindspots}`);
  if (fu.strongestDisagreement) lines.push(`Strongest disagreement: ${fu.strongestDisagreement}`);
  return lines.join("\n");
}
