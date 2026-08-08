/**
 * Canonical Memory models — AAS-Buch2 0.3.4
 * Field names and semantics are normative. Do not invent.
 */

import { z } from "zod";
import type { UUID, Timestamp, Version, Score, SourceType, PhysicsVersion, FormulaVersion } from "./types.js";

// ── AAS-28 TemporalMetadata ──────────────────────────────────────────

export interface TemporalMetadata {
  createdAt: Timestamp;
  observedAt: Timestamp;
  validFrom: Timestamp;
  validTo: Timestamp | null;
  confirmedAt: Timestamp;
  deprecatedAt: Timestamp | null;
}

export const TemporalMetadataSchema = z
  .object({
    createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
    observedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
    validFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
    validTo: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      .nullable(),
    confirmedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
    deprecatedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      .nullable(),
  })
  .refine(
    (t) => t.validTo === null || t.validFrom <= t.validTo,
    "validFrom <= validTo when validTo is not null"
  )
  .refine((t) => t.confirmedAt >= t.createdAt, "confirmedAt >= createdAt")
  .refine(
    (t) => t.deprecatedAt === null || t.deprecatedAt >= t.createdAt,
    "deprecatedAt >= createdAt when not null"
  );

// ── AAS-29 Provenance ────────────────────────────────────────────────

export interface Provenance {
  sourceType: SourceType;
  sourceId?: string;
  capturedAt: Timestamp;
  parentMemoryIds: UUID[];
  evidenceIds: UUID[];
}

export const ProvenanceSchema = z.object({
  sourceType: z.enum([
    "user",
    "conversation",
    "document",
    "web",
    "system",
    "agent",
    "import",
    "sensor",
    "event",
  ]),
  sourceId: z.string().optional(),
  capturedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
  parentMemoryIds: z.array(z.string().uuid()),
  evidenceIds: z.array(z.string().uuid()),
});

// ── AAS-30 Evidence ──────────────────────────────────────────────────

export interface Evidence {
  id: UUID;
  type: "direct" | "derived" | "corroborating" | "contradicting";
  sourceType: SourceType;
  sourceId?: string;
  excerpt?: string;
  locator?: string;
  capturedAt: Timestamp;
  reliability?: Score;
  independenceGroup?: string;
}

export const EvidenceSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(["direct", "derived", "corroborating", "contradicting"]),
  sourceType: z.enum([
    "user",
    "conversation",
    "document",
    "web",
    "system",
    "agent",
    "import",
    "sensor",
    "event",
  ]),
  sourceId: z.string().optional(),
  excerpt: z.string().optional(),
  locator: z.string().optional(),
  capturedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
  reliability: z.number().min(0).max(1).optional(),
  independenceGroup: z.string().optional(),
});

// ── AAS-31 MemoryIdentity ────────────────────────────────────────────

export interface MemoryIdentity {
  id: UUID;
  shortId: string;
  version: Version;
  canonical: boolean;
}

export const MemoryIdentitySchema = z.object({
  id: z.string().uuid(),
  shortId: z.string().min(1),
  version: z.number().int().positive(),
  canonical: z.boolean(),
});

// ── AAS-32 MemoryContent ─────────────────────────────────────────────

export type MemoryContent =
  | { type: "text"; text: string; mimeType?: string }
  | { type: "structured"; structuredData: Record<string, unknown> }
  | { type: "document"; storageRef: string; mimeType?: string }
  | { type: "media"; storageRef: string; mimeType?: string }
  | { type: "reference"; storageRef: string };

export const MemoryContentSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string(),
    mimeType: z.string().optional(),
  }),
  z.object({
    type: z.literal("structured"),
    structuredData: z.record(z.unknown()),
  }),
  z.object({
    type: z.literal("document"),
    storageRef: z.string().min(1),
    mimeType: z.string().optional(),
  }),
  z.object({
    type: z.literal("media"),
    storageRef: z.string().min(1),
    mimeType: z.string().optional(),
  }),
  z.object({
    type: z.literal("reference"),
    storageRef: z.string().min(1),
  }),
]);

// ── AAS-33 MemoryContext ─────────────────────────────────────────────

export interface MemoryContext {
  domain?: string;
  project?: string;
  location?: string;
  participants?: string[];
  tags?: string[];
  sessionId?: UUID;
  parentContextId?: UUID;
}

export const MemoryContextSchema = z.object({
  domain: z.string().optional(),
  project: z.string().optional(),
  location: z.string().optional(),
  participants: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  sessionId: z.string().uuid().optional(),
  parentContextId: z.string().uuid().optional(),
});

// ── AAS-34 MemoryMeaning ─────────────────────────────────────────────

export interface MemoryMeaning {
  summary?: string;
  concepts?: string[];
  themes?: string[];
  interpretation?: string;
  generatedBy?: string;
  generatedAt?: Timestamp;
}

export const MemoryMeaningSchema = z.object({
  summary: z.string().optional(),
  concepts: z.array(z.string()).optional(),
  themes: z.array(z.string()).optional(),
  interpretation: z.string().optional(),
  generatedBy: z.string().optional(),
  generatedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    .optional(),
});

// ── AAS-35 Lifecycle ─────────────────────────────────────────────────

export type LifecycleState =
  | "active"
  | "dormant"
  | "archived"
  | "dream_candidate"
  | "hypothesis";

export interface LifecycleMetadata {
  state: LifecycleState;
  changedAt: Timestamp;
  reason?: string;
}

export const LifecycleMetadataSchema = z.object({
  state: z.enum([
    "active",
    "dormant",
    "archived",
    "dream_candidate",
    "hypothesis",
  ]),
  changedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
  reason: z.string().optional(),
});

// ── AAS-36 CognitiveStateVector (projection) ─────────────────────────

export interface CognitiveStateVector {
  mass: Score;
  energy: Score;
  gravity: Score;
  entropy: Score;
  velocity: { mass: number; resonance: number; temperature: number };
  confidence: Score;
  resonance: Score;
  temperature: Score;
  novelty: Score;
  calculatedAt: Timestamp;
  physicsVersion: PhysicsVersion;
  formulaVersion: FormulaVersion;
}

export const CognitiveStateVectorSchema = z.object({
  mass: z.number().min(0).max(1),
  energy: z.number().min(0).max(1),
  gravity: z.number().min(0).max(1),
  entropy: z.number().min(0).max(1),
  velocity: z.object({
    mass: z.number(),
    resonance: z.number(),
    temperature: z.number(),
  }),
  confidence: z.number().min(0).max(1),
  resonance: z.number().min(0).max(1),
  temperature: z.number().min(0).max(1),
  novelty: z.number().min(0).max(1),
  calculatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
  physicsVersion: z.string().min(1),
  formulaVersion: z.string().min(1),
});

/**
 * Deterministic zero placeholder for Phase 06 (Physics wiring is Phase 08).
 * Reconstructible from event timestamp; no invented formula values.
 */
export function zeroCognitiveState(calculatedAt: Timestamp): CognitiveStateVector {
  return {
    mass: 0,
    energy: 0,
    gravity: 0,
    entropy: 0,
    velocity: { mass: 0, resonance: 0, temperature: 0 },
    confidence: 0,
    resonance: 0,
    temperature: 0,
    novelty: 0,
    calculatedAt,
    physicsVersion: "0.1.4",
    formulaVersion: "0.2.5",
  };
}

// ── AAS-39 RelationRef (minimal for MemoryCell) ──────────────────────

export type RelationType =
  | "supports"
  | "contradicts"
  | "extends"
  | "derived_from"
  | "inspired_by"
  | "causes"
  | "caused_by"
  | "references"
  | "answers"
  | "asks"
  | "belongs_to"
  | "part_of"
  | "depends_on"
  | "duplicates"
  | "similar_to"
  | "related_to";

export interface RelationRef {
  relationId: UUID;
  targetMemoryId: UUID;
  type: RelationType;
  direction: "outgoing" | "incoming";
}

export const RelationRefSchema = z.object({
  relationId: z.string().uuid(),
  targetMemoryId: z.string().uuid(),
  type: z.enum([
    "supports",
    "contradicts",
    "extends",
    "derived_from",
    "inspired_by",
    "causes",
    "caused_by",
    "references",
    "answers",
    "asks",
    "belongs_to",
    "part_of",
    "depends_on",
    "duplicates",
    "similar_to",
    "related_to",
  ]),
  direction: z.enum(["outgoing", "incoming"]),
});

// ── AAS-37 MemoryCell ────────────────────────────────────────────────

export interface MemoryCell {
  identity: MemoryIdentity;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  lifecycle: LifecycleMetadata;
  timestamps: TemporalMetadata;
  cognitiveState: CognitiveStateVector;
  relationRefs: RelationRef[];
  currentVersion: Version;
}

export const MemoryCellSchema = z.object({
  identity: MemoryIdentitySchema,
  content: MemoryContentSchema,
  context: MemoryContextSchema,
  meaning: MemoryMeaningSchema.optional(),
  provenance: ProvenanceSchema,
  evidence: z.array(EvidenceSchema),
  lifecycle: LifecycleMetadataSchema,
  timestamps: TemporalMetadataSchema,
  cognitiveState: CognitiveStateVectorSchema,
  relationRefs: z.array(RelationRefSchema),
  currentVersion: z.number().int().positive(),
});

// ── AAS-38 MemoryVersion ─────────────────────────────────────────────

export interface MemoryVersion {
  memoryId: UUID;
  version: Version;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  timestamps: TemporalMetadata;
  createdAt: Timestamp;
  createdBy: string;
  previousVersion?: Version;
  changeReason?: string;
}

export const MemoryVersionSchema = z.object({
  memoryId: z.string().uuid(),
  version: z.number().int().positive(),
  content: MemoryContentSchema,
  context: MemoryContextSchema,
  meaning: MemoryMeaningSchema.optional(),
  provenance: ProvenanceSchema,
  evidence: z.array(EvidenceSchema),
  timestamps: TemporalMetadataSchema,
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
  createdBy: z.string().min(1),
  previousVersion: z.number().int().positive().optional(),
  changeReason: z.string().optional(),
});
