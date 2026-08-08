/**
 * Pure AKP Physics for Phase 04 CV-01..CV-44.
 * formulaIds/math match AKP 0.1.4 / 0.2.5 — not redesigned.
 * No network, DB, providers, randomness, wall-clock.
 */
export const SCORE_TOL = 1e-6;
export const COSINE_TOL = 1e-9;

export function clamp(x, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, x));
}
export function almostEqual(a, b, tol = SCORE_TOL) {
  return Math.abs(Number(a) - Number(b)) <= tol;
}

export function importance(explicitUserPriority) {
  if (explicitUserPriority === undefined || explicitUserPriority === null)
    return 0.5;
  return clamp(Number(explicitUserPriority));
}

export function usage(access_count_in_rolling_window, access_window_size = 20) {
  return Math.min(1, access_count_in_rolling_window / access_window_size);
}

export function effectiveReliability(e) {
  return e && e.reliability != null ? Number(e.reliability) : 0.5;
}

export function evidenceStrength(evidences) {
  if (!evidences || evidences.length === 0) return 0;
  return (
    evidences.reduce((s, e) => s + effectiveReliability(e), 0) /
    evidences.length
  );
}

export function sourceDiversity(evidences) {
  if (!evidences || evidences.length === 0) return 0;
  const groups = new Set(
    evidences.map((e) =>
      e.independenceGroup != null ? e.independenceGroup : "unknown"
    )
  );
  return groups.size / Math.max(1, evidences.length);
}

export function contradiction(evidences) {
  if (!evidences || evidences.length === 0) return 0;
  const total = evidences.reduce((s, e) => s + effectiveReliability(e), 0);
  const contra = evidences
    .filter((e) => e.type === "contradicting")
    .reduce((s, e) => s + effectiveReliability(e), 0);
  return clamp(contra / Math.max(1, total));
}

export function cosine(a, b) {
  if (!a || !b) return 0;
  if (a.length !== b.length) {
    const err = new Error("dimension_mismatch");
    err.code = "rejected_snapshot";
    throw err;
  }
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const da = Math.sqrt(na),
    db = Math.sqrt(nb);
  if (da === 0 || db === 0) return 0;
  return dot / (da * db);
}

export function novelty(maxCosineToOthers) {
  if (maxCosineToOthers === null || maxCosineToOthers === undefined) return 1.0;
  return clamp(1 - maxCosineToOthers);
}

export function confidence(E, SD, C) {
  return clamp(E * SD * (1 - C));
}

export function resonance(fractions, age, mu = 0.1) {
  const { R_f = 0, A_f = 0, C_f = 0, L_f = 0, Q_f = 0 } = fractions;
  const R_raw = 0.25 * R_f + 0.2 * A_f + 0.2 * C_f + 0.2 * L_f + 0.15 * Q_f;
  const TemporalFactor = Math.exp(-mu * age);
  return clamp(R_raw * TemporalFactor);
}

export function mass(I, U, Conf, R) {
  return clamp(0.3 * I + 0.25 * U + 0.25 * Conf + 0.2 * R);
}

export function workingSetFactor(workingSetMembership) {
  return workingSetMembership === true ? 1.0 : 0.3;
}

export function temperature(AccessRate, RecentInfluence, workingSetMembership) {
  return clamp(
    AccessRate * RecentInfluence * workingSetFactor(workingSetMembership)
  );
}

export function sourceDecay(evidences) {
  if (!evidences || evidences.length === 0) return 1.0;
  const avg =
    evidences.reduce((s, e) => s + effectiveReliability(e), 0) /
    evidences.length;
  return 1.0 - avg;
}

export function entropy({ ageDecay, C, sourceDecay: sd, uncertainty }) {
  return clamp(0.25 * ageDecay + 0.3 * C + 0.2 * sd + 0.25 * uncertainty);
}

export function velocity(delta, dt) {
  const d = Math.max(1, dt);
  return delta / d;
}

export function connectivityPotential(count, denom = 5) {
  return Math.min(1, count / denom);
}

export function energy(N, CP, H, R) {
  return clamp(N * CP * (1 - H) * R);
}

export function gravity(Mass, R, weightedDegree) {
  const Connectivity = Math.min(1, weightedDegree / 10);
  return clamp(Mass * R * Connectivity);
}

export function dreamSimple(EA, EB, RA, RB, S, N, Tg) {
  return clamp(EA * EB * RA * RB * (1 - S) * N * Tg);
}

export function relationStrength(E, C, T, U) {
  return clamp(0.35 * E + 0.25 * C + 0.2 * T + 0.2 * U);
}

export function degreeCentrality(deg, N) {
  return deg / Math.max(1, N - 1);
}

export function weightedDegree(sumS, maxPossible = 1) {
  return sumS / Math.max(1, maxPossible);
}

export function graphGravity(M, R, WD, Centrality) {
  const Connectivity = Math.min(1, WD / 10);
  return clamp(M * R * Connectivity * (1 + Centrality));
}

export function bridge(Centrality, ClusterDiversity, N) {
  return clamp(Centrality * ClusterDiversity * N);
}

export function graphDistance(pathCosts) {
  if (pathCosts === null) return Infinity;
  return pathCosts.reduce((a, b) => a + b, 0);
}

export function semanticSimilarity(a, b) {
  const c = cosine(a, b);
  const S = clamp((c + 1) / 2);
  return { cosine: c, S };
}

export function retrievalScore(signals) {
  const {
    S = 0,
    G = 0,
    T = 0,
    R = 0,
    M = 0,
    C = 0,
    N = 0,
  } = signals;
  return clamp(
    0.3 * S + 0.15 * G + 0.1 * T + 0.15 * R + 0.1 * M + 0.1 * C + 0.1 * N
  );
}

export function temporalRelevance(deltaT, lambdaDecay = 0) {
  return Math.exp(-lambdaDecay * deltaT);
}

export function priority(I, Relevance, Urgency, Potential) {
  const U = Urgency == null ? 0 : Urgency;
  return clamp(I * Relevance * U * Potential);
}

export function load(contextSize, attentionCapacity) {
  if (!(attentionCapacity > 0)) return { status: "rejected_snapshot" };
  return { status: "ok", load: contextSize / attentionCapacity };
}

export function loadEvict(items, capacity, threshold = 0.85) {
  // items: [{memoryId, priority}]
  if (!(capacity > 0)) return { status: "rejected_snapshot" };
  let remaining = items.slice().sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority; // lowest first for eviction
    return a.memoryId < b.memoryId ? -1 : a.memoryId > b.memoryId ? 1 : 0;
  });
  // Actually: while load > threshold, remove lowest priority; MemoryId asc
  let list = items.slice();
  let Load = list.length / capacity;
  const evicted = [];
  while (Load > threshold && list.length > 0) {
    list.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.memoryId < b.memoryId ? -1 : a.memoryId > b.memoryId ? 1 : 0;
    });
    const victim = list.shift();
    evicted.push(victim.memoryId);
    Load = list.length / capacity;
  }
  return { status: "ok", load: Load, remainingIds: list.map((x) => x.memoryId).sort(), evicted };
}

export function cognitiveSaturation(topKBefore, topKAfter, K) {
  const before = new Set(topKBefore);
  const after = new Set(topKAfter);
  let inter = 0;
  for (const x of before) if (after.has(x)) inter++;
  const rankingChange = 1 - inter / K;
  return { rankingChange, saturated: rankingChange < 0.02 };
}

export function diversitySelection(
  candidates,
  finalK,
  diversity_cosine_threshold = 0.92,
  diversity_penalty_factor = 0.5
) {
  // candidates: [{memoryId, baseRetrievalScore, independenceGroup, embedding}]
  const selected = [];
  const remaining = candidates.slice();
  while (selected.length < finalK && remaining.length > 0) {
    let best = null;
    let bestAdj = -Infinity;
    for (const c of remaining) {
      let penalty = 1.0;
      for (const s of selected) {
        let cos = 0;
        try {
          cos = cosine(c.embedding || [0], s.embedding || [0]);
        } catch {
          cos = 0;
        }
        if (
          c.independenceGroup === s.independenceGroup ||
          cos > diversity_cosine_threshold
        ) {
          penalty = Math.min(penalty, diversity_penalty_factor);
        }
      }
      const adjusted = c.baseRetrievalScore * penalty;
      if (
        adjusted > bestAdj ||
        (almostEqual(adjusted, bestAdj) &&
          best &&
          c.memoryId < best.memoryId) ||
        (almostEqual(adjusted, bestAdj) && !best)
      ) {
        // tie-break MemoryId ascending
        if (best && almostEqual(adjusted, bestAdj) && c.memoryId > best.memoryId)
          continue;
        best = c;
        bestAdj = adjusted;
      }
    }
    selected.push(best);
    const idx = remaining.findIndex((x) => x.memoryId === best.memoryId);
    remaining.splice(idx, 1);
  }
  return selected.map((s) => s.memoryId);
}

export function dream20({
  EA,
  EB,
  BridgeA,
  BridgeB,
  N,
  Tg,
  AttentionAllocation,
  Sr,
}) {
  const BridgePotential = BridgeA * BridgeB;
  const D = clamp(
    EA * EB * BridgePotential * N * Tg * AttentionAllocation * (1 - Sr)
  );
  return { D, BridgePotential };
}

export function dreamSafetyGate({ Tg, N, Sr }) {
  if (Tg >= 0.4 && N >= 0.3 && Sr <= 0.5)
    return { status: "PASS", kind: "HYPOTHESIS" };
  return { status: "REJECTED", kind: null };
}

export function emergence({ N, BridgePotential, Surprise, Coherence }) {
  return clamp(N * BridgePotential * Surprise * Coherence);
}

export function islandScore({ Cohesion, ExternalConnectivity }) {
  return clamp(Cohesion * (1 - ExternalConnectivity));
}

export function physicsCalculationConformant(calc) {
  if (!calc || typeof calc !== "object")
    return { status: "non-conformant", reason: "missing_calc" };
  if (!calc.formulaId)
    return { status: "non-conformant", reason: "missing_formulaId" };
  return { status: "conformant" };
}

export function formulaOutputMatches(calc, key, expected, tol = SCORE_TOL) {
  if (!calc?.formulaId)
    return { status: "non-conformant", reason: "missing_formulaId" };
  const out = calc.output;
  if (!out || out[key] === undefined)
    return { status: "non-conformant", reason: "missing_output_key" };
  if (!almostEqual(Number(out[key]), expected, tol))
    return { status: "non-conformant", reason: "formulaId_output_mismatch" };
  return { status: "conformant" };
}

export function symmetricIntegrity(edges) {
  // edges: [{from,to,type,strength}]
  const symmetric = new Set(["similar_to", "related_to", "duplicates"]);
  for (const e of edges) {
    if (!symmetric.has(e.type)) continue;
    const counterpart = edges.find(
      (x) =>
        x.from === e.to &&
        x.to === e.from &&
        x.type === e.type &&
        almostEqual(x.strength, e.strength)
    );
    if (!counterpart)
      return { status: "graph_integrity_violation" };
  }
  return { status: "conformant" };
}

export function explainabilityComplete(calc) {
  const req = [
    "formulaId",
    "formulaVersion",
    "parameterSetId",
    "parameterSetVersion",
    "parameterSet",
    "inputSnapshot",
    "output",
  ];
  for (const k of req) {
    if (calc[k] === undefined || calc[k] === null)
      return { status: "non-conformant", missing: k };
  }
  return { status: "conformant" };
}

export function dedupFirstWins(items) {
  // items: [{memoryId, ...}] in arrival order
  const seen = new Set();
  const out = [];
  for (const it of items) {
    if (seen.has(it.memoryId)) continue;
    seen.add(it.memoryId);
    out.push(it.memoryId);
  }
  return out;
}

export function temporalEligibility(items, queryTime, lambdaDecay) {
  if (lambdaDecay === 0) return items.map((i) => i.memoryId);
  return items
    .filter((i) => {
      if (i.validTo != null && i.validTo < queryTime) return false;
      if (i.deprecatedAt != null && i.deprecatedAt <= queryTime) return false;
      return true;
    })
    .map((i) => i.memoryId);
}

export function sortByPriority(items) {
  // Priority desc, MemoryId asc
  return items
    .slice()
    .sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.memoryId < b.memoryId ? -1 : a.memoryId > b.memoryId ? 1 : 0;
    })
    .map((i) => i.memoryId);
}

export function aas54Equal(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function connectivityCountOnce(targets) {
  // targets already distinct high-mass with weak/missing relations
  const unique = new Set(targets);
  return unique.size;
}
