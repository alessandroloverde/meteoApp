/**
 * Deep-merge plain objects. Arrays and non-objects are replaced, not concatenated.
 * `null` / `undefined` in source skip (keep target). Explicit empty object `{}` merges in.
 *
 * @param {Record<string, unknown>} target
 * @param {Record<string, unknown>} source
 * @returns {Record<string, unknown>}
 */
export function deepMerge(target = {}, source = {}) {
  const out = { ...target }

  for (const key of Object.keys(source)) {
    const sv = source[key]
    if (sv == null) continue

    const tv = out[key]
    if (isPlainObject(tv) && isPlainObject(sv)) {
      out[key] = deepMerge(tv, sv)
    } else {
      out[key] = sv
    }
  }

  return out
}

function isPlainObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}
