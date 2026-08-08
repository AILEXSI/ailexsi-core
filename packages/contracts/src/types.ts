/**
 * Canonical common types — AAS-Buch2 0.3.4
 * No invented types. UUID and Timestamp rules are normative.
 */

/** UUID string. v4 generation only at command-creation boundaries. */
export type UUID = string;

/**
 * Canonical Timestamp: RFC3339 UTC, exactly 3 fractional digits, mandatory Z.
 * Example: 2026-08-08T01:26:00.000Z
 */
export type Timestamp = string;

/** Positive integer version (aggregateVersion, MemoryVersion, …). */
export type Version = number;

export type PhysicsVersion = string;
export type FormulaVersion = string;

export type Score = number; // 0 <= Score <= 1

export type SourceType =
  | "user"
  | "conversation"
  | "document"
  | "web"
  | "system"
  | "agent"
  | "import"
  | "sensor"
  | "event";
