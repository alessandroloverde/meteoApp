const STORAGE_KEY = 'meteo-reference-bg'

export function loadReferenceBackgroundFilename(): string | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    const filename = data?.filename
    return typeof filename === 'string' && filename.length > 0 ? filename : null
  } catch {
    return null
  }
}

export function saveReferenceBackgroundFilename(filename: string) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ filename }))
  } catch { /* quota / private-mode — ignore */ }
}
