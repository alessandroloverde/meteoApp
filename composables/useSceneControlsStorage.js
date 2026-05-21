const STORAGE_KEY = 'meteo-scene-controls'

/**
 * @typedef {{ season: string, time: string, weather: string, temp: string }} SceneControlsSnapshot
 */

/** @returns {SceneControlsSnapshot | null} */
export function loadSceneControls() {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    return {
      season: data.season,
      time: data.time,
      weather: data.weather,
      temp: data.temp,
    }
  } catch {
    return null
  }
}

/** @param {SceneControlsSnapshot} snapshot */
export function saveSceneControls(snapshot) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch { /* quota / private-mode — ignore */ }
}
