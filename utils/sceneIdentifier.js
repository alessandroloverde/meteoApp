/**
 * Canonical scene key for simulation, references, and future asset naming.
 * Order matches API-style mapping: weather → season → time → temperature band.
 *
 * @example buildSceneIdentifier({ weather: 'cloudy', season: 'autumn', time: 'morning', temp: 'cold' })
 *          // => 'cloudy--autumn--morning--cold'
 *
 * @param {{ weather: string, season: string, time: string, temp: string }} axes
 * @returns {string}
 */
export function buildSceneIdentifier({ weather, season, time, temp }) {
  return `${weather}--${season}--${time}--${temp}`
}

/**
 * @param {string} sceneId — weather--season--time--temp
 * @returns {{ weather: string, season: string, time: string, temp: string } | null}
 */
export function parseSceneIdentifier(sceneId) {
  const parts = sceneId.split('--')
  if (parts.length !== 4) return null

  return {
    weather: parts[0],
    season: parts[1],
    time: parts[2],
    temp: parts[3],
  }
}
