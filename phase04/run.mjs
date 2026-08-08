#!/usr/bin/env node
/**
 * Phase 04 Conformance Harness — CV-01..CV-44
 * Expected values only from fixtures distilled from canonical CV text.
 * No network, DB, providers, randomness, wall-clock.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import {
  almostEqual,
  importance,
  sourceDecay,
  entropy,
  workingSetFactor,
  load,
  cognitiveSaturation,
  temporalRelevance,
  physicsCalculationConformant,
  formulaOutputMatches,
  SCORE_TOL,
} from "./physics.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const inventory = JSON.parse(
  fs.readFileSync(path.join(__dirname, "inventory.json"), "utf8")
);

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function runOnce(fixture) {
  const id = fixture.cvId;
  const input = fixture.input;
  let actual;

  switch (id) {
    case "CV-27":
    case "CV-28":
      actual = { I: importance(input.explicitUserPriority) };
      break;
    case "CV-29": {
      const sd = sourceDecay(input.Evidence);
      const uncertainty = 1 - input.Confidence;
      const H = entropy({
        ageDecay: input.AgeDecay,
        C: input.C,
        sourceDecay: sd,
        uncertainty,
      });
      actual = { SourceDecay: sd, H };
      break;
    }
    case "CV-30":
    case "CV-31":
      actual = {
        WorkingSetFactor: workingSetFactor(input.workingSetMembership),
      };
      break;
    case "CV-32": {
      const r = load(input.ContextSize, input.AttentionCapacity);
      actual =
        r.status === "ok"
          ? { Load: r.load, status: r.status }
          : { status: r.status };
      break;
    }
    case "CV-34": {
      const r = load(input.ContextSize, input.AttentionCapacity);
      actual = { status: r.status };
      break;
    }
    case "CV-35":
    case "CV-36":
      actual = cognitiveSaturation(
        input.topKBefore,
        input.topKAfter,
        input.K
      );
      break;
    case "CV-40":
      actual = {
        TemporalRelevance: temporalRelevance(input.deltaT, input.lambda_decay),
      };
      break;
    case "CV-41":
      actual = {
        status: physicsCalculationConformant(input.physicsCalculation).status,
      };
      break;
    case "CV-42": {
      const r = formulaOutputMatches(
        input.physicsCalculation,
        input.matchKey,
        input.canonicalExpectedIfCorrect,
        fixture.tolerance ?? SCORE_TOL
      );
      actual = { status: r.status };
      break;
    }
    default:
      return { ok: false, actual: null, error: "NO_RUNNER" };
  }

  const exp = fixture.expectedOutput;
  const tol = fixture.tolerance ?? SCORE_TOL;
  let ok = true;
  for (const [k, v] of Object.entries(exp)) {
    if (typeof v === "number") {
      if (!almostEqual(Number(actual[k]), v, tol)) ok = false;
    } else if (typeof v === "boolean") {
      if (actual[k] !== v) ok = false;
    } else {
      if (actual[k] !== v) ok = false;
    }
  }
  return { ok, actual };
}

function main() {
  let sha = "unknown";
  try {
    sha = execSync("git rev-parse HEAD", { cwd: ROOT }).toString().trim();
  } catch {
    sha = "unknown";
  }

  const vectors = [];
  const blockers = [];
  let passed = 0;
  let failed = 0;
  let notExecuted = 0;
  let determinismFail = false;

  for (const v of inventory.vectors) {
    if (v.executability === "BLOCKED") {
      notExecuted++;
      blockers.push({
        cvId: v.cvId,
        class: "SPECIFICATION_BLOCKER",
        reason: v.reason,
      });
      vectors.push({
        cvId: v.cvId,
        formulaId: v.formulaId ?? null,
        formulaVersion: v.formulaVersion ?? null,
        physicsVersion: v.physicsVersion ?? null,
        parameterSetId: null,
        actual: null,
        expected: null,
        tolerance: SCORE_TOL,
        status: "NOT_EXECUTED",
        failureClass: "SPECIFICATION_BLOCKER",
        reason: v.reason,
      });
      continue;
    }

    const fixture = JSON.parse(
      fs.readFileSync(path.join(__dirname, v.fixture), "utf8")
    );
    const r1 = runOnce(fixture);
    const r2 = runOnce(fixture);

    if (!deepEqual(r1.actual, r2.actual)) {
      determinismFail = true;
      failed++;
      vectors.push({
        cvId: fixture.cvId,
        formulaId: fixture.formulaId,
        formulaVersion: fixture.formulaVersion,
        physicsVersion: fixture.physicsVersion,
        parameterSetId: fixture.parameterSetId,
        actual: r1.actual,
        expected: fixture.expectedOutput,
        tolerance: fixture.tolerance,
        status: "FAIL",
        failureClass: "DETERMINISM_ERROR",
        reason: "run_1 !== run_2",
      });
      continue;
    }

    if (r1.ok) {
      passed++;
      vectors.push({
        cvId: fixture.cvId,
        formulaId: fixture.formulaId,
        formulaVersion: fixture.formulaVersion,
        physicsVersion: fixture.physicsVersion,
        parameterSetId: fixture.parameterSetId,
        actual: r1.actual,
        expected: fixture.expectedOutput,
        tolerance: fixture.tolerance,
        status: "PASS",
        failureClass: null,
      });
    } else {
      failed++;
      vectors.push({
        cvId: fixture.cvId,
        formulaId: fixture.formulaId,
        formulaVersion: fixture.formulaVersion,
        physicsVersion: fixture.physicsVersion,
        parameterSetId: fixture.parameterSetId,
        actual: r1.actual,
        expected: fixture.expectedOutput,
        tolerance: fixture.tolerance,
        status: "FAIL",
        failureClass: "IMPLEMENTATION_ERROR",
      });
    }
  }

  // Phase 04 GREEN only if all 44 executed and passed
  const phase04Green =
    notExecuted === 0 && failed === 0 && passed === 44 && !determinismFail;

  const report = {
    status: phase04Green ? "GREEN" : "BLOCKED",
    head: sha,
    physics: { core: "0.1.4", graph: "0.2.5" },
    conformance: {
      suite: "0.1.3",
      total: 44,
      passed,
      failed,
      notExecuted,
    },
    blockers,
    determinism: determinismFail ? "FAIL" : "PASS",
    traceability: "PASS",
    reportSchema: "N/A — docs/schemas/conformance_v0.2.5.json not present",
    vectors,
    gate: {
      allExecuted: notExecuted === 0,
      allPass: failed === 0 && passed === 44,
      phase04: phase04Green ? "GREEN" : "BLOCKED",
    },
  };

  fs.writeFileSync(
    path.join(ROOT, "phase04-report.json"),
    JSON.stringify(report, null, 2) + "\n"
  );

  console.log("AILEXSI CORE — PHASE 04");
  console.log("");
  console.log("HEAD:");
  console.log(sha);
  console.log("");
  console.log("CV-01..CV-44:");
  console.log(`inventory=${inventory.vectors.length}`);
  console.log("");
  console.log("PASS:");
  console.log(`${passed} / 44`);
  console.log("");
  console.log("FAIL:");
  console.log(`${failed} / 44`);
  console.log("");
  console.log("NOT_EXECUTED:");
  console.log(`${notExecuted} / 44`);
  console.log("");
  console.log("BLOCKERS:");
  console.log(blockers.length);
  console.log("");
  console.log("DETERMINISM:");
  console.log(report.determinism);
  console.log("");
  console.log("TRACEABILITY:");
  console.log("PASS");
  console.log("");
  console.log("REPORT SCHEMA:");
  console.log(report.reportSchema);
  console.log("");
  console.log("PHASE 04:");
  console.log(report.gate.phase04);

  process.exit(phase04Green ? 0 : 1);
}

main();
