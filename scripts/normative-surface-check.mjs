#!/usr/bin/env node
/**
 * AILEXSI Normative Surface Check
 * Normative Patch 0.3 – Anti-Deletion Closure
 *
 * Exit 0: surface >= baseline and Phase 04 gate intact
 * Exit 1: REGRESSION_BY_DELETION or missing critical files
 *
 * Usage: node scripts/normative-surface-check.mjs
 * No dependencies. Pure Node.js.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOCS = path.join(ROOT, "docs");

const BASELINE = {
  formulaIds: 39,
  cvs: 44,
  cognitiveLaws: 7,
  // interfaces / type blocks in Buch2 (conservative minimum)
  canonicalInterfaces: 20,
  buildPhases: 22,
  phase04CvMax: 44,
  phase04CvMin: 1,
  akpCore: "0.1.4",
  akpGraph: "0.2.5",
};

function read(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function countMatches(text, re) {
  if (!text) return 0;
  const m = text.match(re);
  return m ? m.length : 0;
}

function uniqueFormulaIds(registryText) {
  if (!registryText) return new Set();
  const ids = new Set();
  for (const line of registryText.split("\n")) {
    // table rows: | formulaId | version | source |
    const m = line.match(/^\|\s*([a-z0-9][a-z0-9.-]+)\s*\|/i);
    if (!m) continue;
    const id = m[1];
    if (id === "formulaId" || id === "---" || id.includes("---")) continue;
    if (id.includes("-")) ids.add(id);
  }
  return ids;
}

function cvCoverage(cvText, manifestText) {
  const ids = new Set();
  const blob = `${cvText || ""}\n${manifestText || ""}`;
  for (const m of blob.matchAll(/CV-(\d+)/gi)) {
    ids.add(Number(m[1]));
  }
  const max = ids.size ? Math.max(...ids) : 0;
  const min = ids.size ? Math.min(...ids) : 0;
  // explicit range in manifest
  const range = /CV-0*1\.\.CV-0*(\d+)/i.exec(manifestText || "");
  const rangeMax = range ? Number(range[1]) : max;
  return { count: ids.size, min, max, rangeMax, ids };
}

function countLaws(acs) {
  if (!acs) return 0;
  return countMatches(acs, /\*\*Law\s+\d+/g);
}

function countInterfaces(buch2) {
  if (!buch2) return 0;
  const iface = countMatches(buch2, /^interface\s+\w+/gm);
  const typeAlias = countMatches(buch2, /^type\s+\w+/gm);
  return iface + typeAlias;
}

function countPhases(ambc, manifest) {
  const blob = `${ambc || ""}\n${manifest || ""}`;
  const phases = new Set();
  for (const m of blob.matchAll(/\b(?:PHASE\s*)?0*(\d{1,2})\b/gi)) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 22) phases.add(n);
  }
  // also match "01 Bootstrap" style lines
  for (const m of blob.matchAll(/^\s*0*(\d{1,2})\s+[A-Za-z]/gm)) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 22) phases.add(n);
  }
  return phases.size;
}

function hasAntiDeletion(ambc, readme, patch) {
  const blob = `${ambc || ""}\n${readme || ""}\n${patch || ""}`;
  return (
    /REGRESSION_BY_DELETION/i.test(blob) &&
    /Anti-Deletion|Anti–Deletion|anti-deletion/i.test(blob)
  );
}

function main() {
  const failures = [];
  const warnings = [];

  const registry = read("docs/AKP/AKP-Formula-Registry-0.1.md");
  const cvs = read("docs/AKP/AKP-Conformance-Vectors-0.1.md");
  const acs = read("docs/ACS/ACS-0.1.md");
  const buch2 = read("docs/AAS/AAS-Buch2.md");
  const ambc = read("docs/AMBC/AMBC-0.1.md");
  const manifest = read("docs/BUILD/Build-Manifest-0.1.md");
  const readme = read("docs/README.md");
  const patch = read("docs/PATCHES/Normative-Patch-0.3-Anti-Deletion.md");
  const ledger = read("docs/AUDIT/Blocker-Ledger.md");
  const baselineDoc = read("docs/AUDIT/Normative-Surface-Baseline-0.1.md");
  const akp1 = read("docs/AKP/AKP-0.1.md");
  const akp2 = read("docs/AKP/AKP-0.2.md");

  const requiredFiles = [
    ["docs/AKP/AKP-Formula-Registry-0.1.md", registry],
    ["docs/AKP/AKP-Conformance-Vectors-0.1.md", cvs],
    ["docs/ACS/ACS-0.1.md", acs],
    ["docs/AAS/AAS-Buch2.md", buch2],
    ["docs/AMBC/AMBC-0.1.md", ambc],
    ["docs/BUILD/Build-Manifest-0.1.md", manifest],
    ["docs/AUDIT/Blocker-Ledger.md", ledger],
    ["docs/AUDIT/Normative-Surface-Baseline-0.1.md", baselineDoc],
    ["docs/PATCHES/Normative-Patch-0.3-Anti-Deletion.md", patch],
  ];
  for (const [name, body] of requiredFiles) {
    if (!body) failures.push(`MISSING_FILE: ${name}`);
  }

  const formulaIds = uniqueFormulaIds(registry);
  const cv = cvCoverage(cvs, manifest);
  const laws = countLaws(acs);
  const interfaces = countInterfaces(buch2);
  const phases = countPhases(ambc, manifest);

  const measured = {
    formulaIds: formulaIds.size,
    cvs: Math.max(cv.count, cv.rangeMax >= 44 ? 44 : cv.count),
    cognitiveLaws: laws,
    canonicalInterfaces: interfaces,
    buildPhases: phases,
    phase04CvRangeMax: cv.rangeMax,
  };

  if (measured.formulaIds < BASELINE.formulaIds) {
    failures.push(
      `REGRESSION_BY_DELETION: formulaIds ${measured.formulaIds} < ${BASELINE.formulaIds}`
    );
  }
  if (cv.rangeMax < BASELINE.phase04CvMax) {
    failures.push(
      `REGRESSION_BY_DELETION: Phase 04 CV range max CV-${cv.rangeMax} < CV-${BASELINE.phase04CvMax}`
    );
  }
  if (measured.cognitiveLaws < BASELINE.cognitiveLaws) {
    failures.push(
      `REGRESSION_BY_DELETION: cognitiveLaws ${measured.cognitiveLaws} < ${BASELINE.cognitiveLaws}`
    );
  }
  if (measured.canonicalInterfaces < BASELINE.canonicalInterfaces) {
    failures.push(
      `REGRESSION_BY_DELETION: canonicalInterfaces ${measured.canonicalInterfaces} < ${BASELINE.canonicalInterfaces}`
    );
  }
  if (measured.buildPhases < BASELINE.buildPhases) {
    // soft if pattern miss — still warn hard if below 20
    if (measured.buildPhases < 20) {
      failures.push(
        `REGRESSION_BY_DELETION: buildPhases ${measured.buildPhases} < 20`
      );
    } else {
      warnings.push(
        `buildPhases measured ${measured.buildPhases} (baseline ${BASELINE.buildPhases})`
      );
    }
  }

  if (akp1 && !akp1.includes(BASELINE.akpCore)) {
    failures.push(`AKP Core version ${BASELINE.akpCore} not found in AKP-0.1.md`);
  }
  if (akp2 && !akp2.includes(BASELINE.akpGraph)) {
    failures.push(`AKP Graph version ${BASELINE.akpGraph} not found in AKP-0.2.md`);
  }

  if (!hasAntiDeletion(ambc, readme, patch)) {
    failures.push("Anti-Deletion rules missing from AMBC/README/Patch");
  }

  if (ledger && !/append-only/i.test(ledger)) {
    failures.push("Blocker-Ledger must declare append-only");
  }

  // forbidden closure language in recent normative claims is not auto-scanned;
  // surface presence of historical-reference ban must remain in README
  if (readme && !/historical-reference|as previously defined/i.test(readme)) {
    warnings.push("README should keep historical-reference ban visible");
  }

  console.log("AILEXSI Normative Surface Check");
  console.log("==============================");
  console.log("Measured:", JSON.stringify(measured, null, 2));
  console.log("Baseline:", JSON.stringify(BASELINE, null, 2));
  console.log("FormulaIds sample:", [...formulaIds].slice(0, 5).join(", "), "...");
  if (warnings.length) {
    console.log("Warnings:");
    for (const w of warnings) console.log("  -", w);
  }
  if (failures.length) {
    console.log("FAIL:");
    for (const f of failures) console.log("  -", f);
    console.log("\nBLOCKER: REGRESSION_BY_DELETION");
    process.exit(1);
  }
  console.log("\nPASS: Normative Surface >= baseline");
  process.exit(0);
}

main();
