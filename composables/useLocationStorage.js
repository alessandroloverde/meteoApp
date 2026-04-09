const STORAGE_KEY = 'meteo-selected-location'

export function saveLocation(location) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location))
  } catch { /* quota / private-mode — ignore */ }
}

export function loadLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearLocation() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
}
