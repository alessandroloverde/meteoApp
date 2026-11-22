const STORAGE_KEY = 'meteo-preview-mode'

/**
 * @typedef {'auto' | 'on' | 'off'} PreviewModeOverride
 */

/** @returns {PreviewModeOverride | null} */
export function loadPreviewModeOverride() {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'auto' || raw === 'on' || raw === 'off') return raw
    return null
  } catch {
    return null
  }
}

/** @param {PreviewModeOverride} value */
export function savePreviewModeOverride(value) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch { /* quota / private-mode — ignore */ }
}
