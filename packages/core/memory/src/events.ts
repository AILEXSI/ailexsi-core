/**
 * Memory Domain event types — Phase 06
 * eventType strings are free-form DomainEvent.eventType (AAS-50).
 * No normative enum exists; these are the canonical domain language names.
 */

import type {
  MemoryContent,
  MemoryContext,
  MemoryMeaning,
  Provenance,
  Evidence,
  TemporalMetadata,
  LifecycleMetadata,
  CognitiveStateVector,
  RelationRef,
  Version,
  UUID,
} from "@ailexsi/contracts";

export const MEMORY_AGGREGATE_TYPE = "Memory" as const;

export type MemoryEventType =
  | "MemoryCreated"
  | "MemoryUpdated"
  | "MemoryArchived"
  | "MemoryRestored";

export interface MemoryCreatedPayload {
  memoryId: UUID;
  shortId: string;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  lifecycle: LifecycleMetadata;
  timestamps: TemporalMetadata;
  cognitiveState: CognitiveStateVector;
  relationRefs: RelationRef[];
  version: Version;
}

export interface MemoryUpdatedPayload {
  memoryId: UUID;
  version: Version;
  previousVersion: Version;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  lifecycle: LifecycleMetadata;
  timestamps: TemporalMetadata;
  cognitiveState: CognitiveStateVector;
  relationRefs: RelationRef[];
  changeReason?: string;
  createdBy: string;
}

export interface MemoryLifecyclePayload {
  memoryId: UUID;
  version: Version;
  previousVersion: Version;
  lifecycle: LifecycleMetadata;
  timestamps: TemporalMetadata;
  cognitiveState: CognitiveStateVector;
  /** Snapshot of current cell fields at lifecycle change (for projection rebuild). */
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  relationRefs: RelationRef[];
  changeReason?: string;
  createdBy: string;
}

export type MemoryEventPayload =
  | MemoryCreatedPayload
  | MemoryUpdatedPayload
  | MemoryLifecyclePayload;
