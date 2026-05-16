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
