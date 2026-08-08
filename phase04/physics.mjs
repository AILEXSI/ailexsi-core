/**
 * Pure AKP Physics subset for Phase 04 executable CVs only.
 * formulaIds and math match AKP 0.1.4 / 0.2.5 — not redesigned.
 * No network, DB, providers, randomness, wall-clock.
 */
export const SCORE_TOL = 1e-6;
export const COSINE_TOL = 1e-9;

export function clamp(x, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, x));
}

export function almostEqual(a, b, tol = SCORE_TOL) {
  return Math.abs(a - b) <= tol;
}

/** formulaId: importance-1.0.0 */
export function importance(explicitUserPriority) {
  if (explicitUserPriority === undefined || explicitUserPriority === null) return 0.5;
  return clamp(Number(explicitUserPriority));
}

/** SourceDecay empty case — AKP-7 */
export function sourceDecay(evidences) {
  if (!evidences || evidences.length === 0) return 1.0;
  const avg =
    evidences.reduce((s, e) => s + (e.reliability != null ? Number(e.reliability) : 0.5), 0) /
    evidences.length;
  return 1.0 - avg;
}

/** formulaId: entropy-1.0.0 — weights PS-004 0.25/0.30/0.20/0.25 */
export function entropy({ ageDecay, C, sourceDecay: sd, uncertainty }) {
  const wa = 0.25, wc = 0.3, ws = 0.2, wu = 0.25;
  return clamp(wa * ageDecay + wc * C + ws * sd + wu * uncertainty);
}

/** WorkingSetFactor component of temperature-1.0.0 */
export function workingSetFactor(workingSetMembership) {
  return workingSetMembership === true ? 1.0 : 0.3;
}

/** formulaId: load-1.0.0 */
export function load(contextSize, attentionCapacity) {
  if (!(attentionCapacity > 0)) {
    return { status: "rejected_snapshot" };
  }
  return { status: "ok", load: contextSize / attentionCapacity };
}

/** formulaId: cognitive-saturation-1.0.0 */
export function cognitiveSaturation(topKBefore, topKAfter, K) {
  if (K <= 0) return { rankingChange: 0, saturated: true };
  const before = new Set(topKBefore);
  const after = new Set(topKAfter);
  let inter = 0;
  for (const x of before) if (after.has(x)) inter++;
  const rankingChange = 1 - inter / K;
  const saturated = rankingChange < 0.02;
  return { rankingChange, saturated };
}

/** formulaId: temporal-relevance-1.0.0 */
export function temporalRelevance(deltaT, lambdaDecay = 0) {
  return Math.exp(-lambdaDecay * deltaT);
}

/**
 * PhysicsCalculation conformance checks (CV-41, CV-42)
 * Missing formulaId → non-conformant
 * formulaId present but output mismatch vs expected key → non-conformant for CV-42 style
 */
export function physicsCalculationConformant(calc) {
  if (!calc || typeof calc !== "object") return { status: "non-conformant", reason: "missing_calc" };
  if (!calc.formulaId) return { status: "non-conformant", reason: "missing_formulaId" };
  return { status: "conformant" };
}

export function formulaOutputMatches(calc, key, expected, tol = SCORE_TOL) {
  if (!calc?.formulaId) return { status: "non-conformant", reason: "missing_formulaId" };
  const out = calc.output;
  if (!out || out[key] === undefined) return { status: "non-conformant", reason: "missing_output_key" };
  if (!almostEqual(Number(out[key]), expected, tol)) {
    return { status: "non-conformant", reason: "formulaId_output_mismatch" };
  }
  return { status: "conformant" };
}
