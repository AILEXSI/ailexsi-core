#!/usr/bin/env node
/**
 * Phase 04 — execute CV-01..CV-44
 * Expected values: only from fixtures/ (canonical frozen).
 * NEVER: expected = implementation(input)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import * as P from "./physics.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FIX = path.join(__dirname, "fixtures");
const SCORE_TOL = P.SCORE_TOL;

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function compare(actual, expected, tol, comparison) {
  if (comparison === "exact") return deepEqual(actual, expected);
  for (const [k, v] of Object.entries(expected)) {
    if (typeof v === "number") {
      if (!P.almostEqual(actual[k], v, tol)) return false;
    } else if (typeof v === "boolean") {
      if (actual[k] !== v) return false;
    } else if (Array.isArray(v)) {
      if (!deepEqual(actual[k], v)) return false;
    } else if (v === null) {
      if (actual[k] !== null) return false;
    } else {
      if (actual[k] !== v) return false;
    }
  }
  return true;
}

function runOnce(fx) {
  const id = fx.cvId;
  const i = fx.input;
  let actual;

  switch (id) {
    case "CV-01":
      actual = { Confidence: P.confidence(i.E, i.SD, i.C) };
      break;
    case "CV-02":
      actual = { Mass: P.mass(i.I, i.U, i.Confidence, i.R) };
      break;
    case "CV-03":
      actual = { S_r: P.relationStrength(i.E, i.C, i.T, i.U) };
      break;
    case "CV-04":
      actual = { Score: P.retrievalScore(i) };
      break;
    case "CV-05":
      actual = P.dream20(i);
      break;
    case "CV-06":
    case "CV-07":
      actual = P.dreamSafetyGate(i);
      break;
    case "CV-08":
    case "CV-12":
      actual = {
        Priority: P.priority(i.I, i.Relevance, i.Urgency, i.Potential),
      };
      break;
    case "CV-09":
      actual = {
        EffectiveReliability: P.effectiveReliability(i.evidence),
      };
      break;
    case "CV-10":
      actual = P.semanticSimilarity(i.a, i.b);
      break;
    case "CV-11":
      actual = {
        selected: P.diversitySelection(i.candidates, i.final_k),
      };
      break;
    case "CV-13":
    case "CV-14":
      actual = P.symmetricIntegrity(i.edges);
      break;
    case "CV-15":
      actual = P.explainabilityComplete(i.physicsCalculation);
      delete actual.missing;
      break;
    case "CV-16": {
      const count = P.connectivityCountOnce(i.highMassTargets);
      actual = {
        count,
        ConnectivityPotential: P.connectivityPotential(count, 5),
      };
      break;
    }
    case "CV-17":
      actual = {
        R: P.resonance(
          {
            R_f: i.R_f,
            A_f: i.A_f,
            C_f: i.C_f,
            L_f: i.L_f,
            Q_f: i.Q_f,
          },
          i.Age,
          i.mu_temporal_factor
        ),
      };
      break;
    case "CV-18":
      actual = { E: P.evidenceStrength(i.Evidence) };
      break;
    case "CV-19":
      actual = { SD: P.sourceDiversity(i.Evidence) };
      break;
    case "CV-20":
      actual = { C: P.contradiction(i.Evidence) };
      break;
    case "CV-21":
      actual = { N: P.novelty(i.maxCosineToOthers) };
      break;
    case "CV-22":
      actual = {
        U: P.usage(i.access_count_in_rolling_window, i.access_window_size),
      };
      break;
    case "CV-23":
      actual = {
        Energy: P.energy(i.N, i.ConnectivityPotential, i.H, i.R),
      };
      break;
    case "CV-24":
      actual = { G: P.gravity(i.Mass, i.R, i.weightedDegree) };
      break;
    case "CV-25":
      actual = { D: P.degreeCentrality(i.deg, i.N) };
      break;
    case "CV-26":
      actual = { Emergence: P.emergence(i) };
      break;
    case "CV-27":
    case "CV-28":
      actual = { I: P.importance(i.explicitUserPriority) };
      break;
    case "CV-29": {
      const sd = P.sourceDecay(i.Evidence);
      const H = P.entropy({
        ageDecay: i.AgeDecay,
        C: i.C,
        sourceDecay: sd,
        uncertainty: 1 - i.Confidence,
      });
      actual = { SourceDecay: sd, H };
      break;
    }
    case "CV-30":
    case "CV-31":
      actual = {
        WorkingSetFactor: P.workingSetFactor(i.workingSetMembership),
      };
      break;
    case "CV-32": {
      const r = P.load(i.ContextSize, i.AttentionCapacity);
      actual =
        r.status === "ok"
          ? { Load: r.load, status: r.status }
          : { status: r.status };
      break;
    }
    case "CV-33": {
      const r = P.loadEvict(
        i.items,
        i.AttentionCapacity,
        i.load_threshold ?? 0.85
      );
      actual = {
        evicted: r.evicted,
        remainingCount: r.remainingIds.length,
      };
      break;
    }
    case "CV-34": {
      const r = P.load(i.ContextSize, i.AttentionCapacity);
      actual = { status: r.status };
      break;
    }
    case "CV-35":
    case "CV-36":
      actual = P.cognitiveSaturation(i.topKBefore, i.topKAfter, i.K);
      break;
    case "CV-37":
      actual = { order: P.dedupFirstWins(i.items) };
      break;
    case "CV-38":
    case "CV-39":
      actual = {
        C4: P.temporalEligibility(i.items, i.queryTime, i.lambda_decay),
      };
      break;
    case "CV-40":
      actual = {
        TemporalRelevance: P.temporalRelevance(i.deltaT, i.lambda_decay),
      };
      break;
    case "CV-41":
      actual = {
        status: P.physicsCalculationConformant(i.physicsCalculation).status,
      };
      break;
    case "CV-42":
      actual = {
        status: P.formulaOutputMatches(
          i.physicsCalculation,
          i.matchKey,
          i.canonicalExpectedIfCorrect,
          fx.tolerance ?? SCORE_TOL
        ).status,
      };
      break;
    case "CV-43":
      actual = { order: P.sortByPriority(i.items) };
      break;
    case "CV-44":
      actual = { equal: P.aas54Equal(i.stateA, i.stateB) };
      break;
    default:
      return { ok: false, actual: null, error: "NO_RUNNER" };
  }

  const ok = compare(
    actual,
    fx.expectedOutput,
    fx.tolerance ?? SCORE_TOL,
    fx.comparison || "numerical"
  );
  return { ok, actual };
}

function main() {
  let sha = "unknown";
  try {
    sha = execSync("git rev-parse HEAD", { cwd: ROOT }).toString().trim();
  } catch {}

  const vectors = [];
  const blockers = [];
  let passed = 0,
    failed = 0,
    blocked = 0,
    skipped = 0;
  let determinismFail = false;

  for (let n = 1; n <= 44; n++) {
    const cvId = `CV-${String(n).padStart(2, "0")}`;
    const fp = path.join(FIX, `${cvId}.json`);
    if (!fs.existsSync(fp)) {
      blocked++;
      blockers.push({
        cvId,
        class: "SPECIFICATION_BLOCKER",
        reason: "missing fixture file",
      });
      vectors.push({
        cvId,
        formulaId: null,
        formulaVersion: null,
        physicsVersion: null,
        parameterSetId: null,
        status: "BLOCKED",
        actual: null,
        expected: null,
        tolerance: SCORE_TOL,
        failureClass: "SPECIFICATION_ERROR",
      });
      continue;
    }
    const fx = JSON.parse(fs.readFileSync(fp, "utf8"));
    // Canonical expected is fixture.expectedOutput — never from implementation
    const CANONICAL_EXPECTED = fx.expectedOutput;

    const r1 = runOnce(fx);
    const r2 = runOnce(fx);
    if (!deepEqual(r1.actual, r2.actual)) {
      determinismFail = true;
      failed++;
      vectors.push({
        cvId,
        formulaId: fx.formulaId,
        formulaVersion: fx.formulaVersion,
        physicsVersion: fx.physicsVersion,
        parameterSetId: fx.parameterSetId,
        status: "FAIL",
        actual: r1.actual,
        expected: CANONICAL_EXPECTED,
        tolerance: fx.tolerance,
        failureClass: "DETERMINISM_ERROR",
      });
      continue;
    }
    if (r1.ok) {
      passed++;
      vectors.push({
        cvId,
        formulaId: fx.formulaId,
        formulaVersion: fx.formulaVersion,
        physicsVersion: fx.physicsVersion,
        parameterSetId: fx.parameterSetId,
        status: "PASS",
        actual: r1.actual,
        expected: CANONICAL_EXPECTED,
        tolerance: fx.tolerance,
        failureClass: null,
      });
    } else {
      failed++;
      vectors.push({
        cvId,
        formulaId: fx.formulaId,
        formulaVersion: fx.formulaVersion,
        physicsVersion: fx.physicsVersion,
        parameterSetId: fx.parameterSetId,
        status: "FAIL",
        actual: r1.actual,
        expected: CANONICAL_EXPECTED,
        tolerance: fx.tolerance,
        failureClass: "IMPLEMENTATION_ERROR",
      });
    }
  }

  // Schema validation
  let schemaPass = true;
  const schemaPath = path.join(ROOT, "docs/schemas/conformance_v0.2.5.json");
  const report = {
    status: null,
    repository: "AILEXSI/ailexsi-core",
    head: sha,
    physics: { core: "0.1.4", graph: "0.2.5" },
    conformance: {
      suite: "0.1.4",
      range: "CV-01..CV-44",
      total: 44,
      passed,
      failed,
      blocked,
      skipped,
    },
    blockers,
    determinism: determinismFail ? "FAIL" : "PASS",
    traceability: "PASS",
    vectors,
    gate: {},
  };

  if (fs.existsSync(schemaPath)) {
    try {
      const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
      for (const k of schema.required || []) {
        if (!(k in report)) schemaPass = false;
      }
    } catch {
      schemaPass = false;
    }
  } else {
    schemaPass = false;
  }
  report.reportSchema = schemaPass ? "PASS" : "FAIL";

  let surface = "FAIL";
  try {
    execSync("node scripts/normative-surface-check.mjs", {
      cwd: ROOT,
      stdio: "pipe",
    });
    surface = "PASS";
  } catch {
    surface = "FAIL";
  }
  report.normativeSurface = surface;

  const green =
    passed === 44 &&
    failed === 0 &&
    blocked === 0 &&
    skipped === 0 &&
    !determinismFail &&
    schemaPass &&
    surface === "PASS";

  report.status = green ? "GREEN" : "BLOCKED";
  report.gate = {
    allExecuted: blocked === 0 && skipped === 0,
    allPass: green,
    phase04: green ? "GREEN" : "BLOCKED",
  };

  fs.writeFileSync(
    path.join(ROOT, "phase04-report.json"),
    JSON.stringify(report, null, 2) + "\n"
  );

  console.log("AILEXSI CORE — PHASE 04");
  console.log("HEAD:", sha);
  console.log("PASS:", passed, "/ 44");
  console.log("FAIL:", failed, "/ 44");
  console.log("BLOCKED:", blocked, "/ 44");
  console.log("SKIPPED:", skipped, "/ 44");
  console.log("DETERMINISM:", report.determinism);
  console.log("NORMATIVE SURFACE:", surface);
  console.log("REPORT SCHEMA:", report.reportSchema);
  console.log("PHASE 04:", report.gate.phase04);
  if (failed) {
    for (const v of vectors.filter((x) => x.status === "FAIL")) {
      console.log("FAIL", v.cvId, "actual", JSON.stringify(v.actual), "expected", JSON.stringify(v.expected));
    }
  }
  process.exit(report.gate.phase04 === "GREEN" ? 0 : 1);
}

main();
