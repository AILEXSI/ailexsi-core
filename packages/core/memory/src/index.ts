/**
 * @ailexsi/memory — Phase 06 Memory Domain
 * Canonical models live in @ailexsi/contracts (AAS-Buch2).
 * This package owns the MemoryDomain service (create/get/update/archive/restore/getHistory)
 * and uses EventStore as the sole write path.
 */

export {
  MemoryDomain,
  type CreateMemoryCommand,
  type UpdateMemoryCommand,
  type LifecycleCommand,
  type MemoryEventType,
} from "./memory-domain.js";
