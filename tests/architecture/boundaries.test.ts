/**
 * Architecture tests — ABS / AMBC import boundary rules.
 * Physics MUST NOT import infrastructure, DB, Drizzle, HTTP, Fastify.
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function collectTsFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      out.push(...collectTsFiles(full));
    } else if (/\.(ts|tsx|mjs|js)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function importsOf(file: string): string[] {
  const src = fs.readFileSync(file, "utf8");
  const re =
    /(?:import|require)\s*(?:[\s\S]*?\sfrom\s*)?['"]([^'"]+)['"]/g;
  const found: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) found.push(m[1]!);
  return found;
}

describe("Architecture boundaries", () => {
  it("packages/physics (if present) has zero infrastructure/DB imports", () => {
    const physicsDir = path.join(ROOT, "packages/physics");
    const files = collectTsFiles(physicsDir);
    for (const f of files) {
      for (const imp of importsOf(f)) {
        expect(imp).not.toMatch(/drizzle|postgres|pgvector|@ailexsi\/persistence|@ailexsi\/eventstore|fastify|next/);
      }
    }
  });

  it("phase04 physics harness has zero DB/infrastructure imports", () => {
    const files = collectTsFiles(path.join(ROOT, "phase04"));
    for (const f of files) {
      for (const imp of importsOf(f)) {
        expect(imp).not.toMatch(
          /drizzle|postgres|pgvector|@ailexsi\/persistence|@ailexsi\/eventstore|fastify|next|pg-boss/
        );
      }
    }
  });

  it("contracts package has zero infrastructure imports", () => {
    const files = collectTsFiles(path.join(ROOT, "packages/contracts"));
    for (const f of files) {
      for (const imp of importsOf(f)) {
        expect(imp).not.toMatch(
          /drizzle|postgres|@ailexsi\/persistence|@ailexsi\/eventstore|fastify|next/
        );
      }
    }
  });

  it("eventstore depends only on contracts + persistence (not HTTP)", () => {
    const files = collectTsFiles(
      path.join(ROOT, "packages/infrastructure/eventstore")
    );
    for (const f of files) {
      for (const imp of importsOf(f)) {
        expect(imp).not.toMatch(/fastify|next|http|express/);
      }
    }
  });
});
