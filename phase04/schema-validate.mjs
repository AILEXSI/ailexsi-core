/**
 * Deterministic JSON Schema validator for Phase 04 report schema.
 * Supports: type, required, properties, enum, items, additionalProperties.
 * No network. No external packages.
 */
export function validateSchema(instance, schema) {
  const errors = [];
  function pathStr(p) {
    return p.length ? "/" + p.join("/") : "(root)";
  }
  function check(value, sch, path) {
    if (!sch || typeof sch !== "object") return;
    if (sch.type) {
      const t = sch.type;
      const ok =
        (t === "object" && value !== null && typeof value === "object" && !Array.isArray(value)) ||
        (t === "array" && Array.isArray(value)) ||
        (t === "string" && typeof value === "string") ||
        (t === "integer" && Number.isInteger(value)) ||
        (t === "number" && typeof value === "number" && !Number.isNaN(value)) ||
        (t === "boolean" && typeof value === "boolean") ||
        (t === "null" && value === null);
      if (!ok) {
        errors.push(`${pathStr(path)}: expected type ${t}, got ${Array.isArray(value) ? "array" : value === null ? "null" : typeof value}`);
        return;
      }
    }
    if (sch.enum && !sch.enum.includes(value)) {
      errors.push(`${pathStr(path)}: value not in enum ${JSON.stringify(sch.enum)}`);
    }
    if (sch.required && typeof value === "object" && value !== null && !Array.isArray(value)) {
      for (const k of sch.required) {
        if (!(k in value)) {
          errors.push(`${pathStr(path)}: missing required property "${k}"`);
        }
      }
    }
    if (sch.properties && typeof value === "object" && value !== null && !Array.isArray(value)) {
      for (const [k, sub] of Object.entries(sch.properties)) {
        if (k in value) check(value[k], sub, path.concat(k));
      }
      if (sch.additionalProperties === false) {
        for (const k of Object.keys(value)) {
          if (!(k in sch.properties)) {
            errors.push(`${pathStr(path)}: additional property "${k}" not allowed`);
          }
        }
      }
    }
    if (sch.items && Array.isArray(value)) {
      value.forEach((item, i) => check(item, sch.items, path.concat(String(i))));
    }
  }
  check(instance, schema, []);
  return { valid: errors.length === 0, errors };
}
