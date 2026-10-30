/**
 * V2 scene registry — weather → season → module + which temp bands use the
 * new authoring tree. Temps not listed here keep the legacy paint + _theme path.
 *
 * Add a temp here only when you start authoring it in `scenes/<weather>/<season>.js`.
 */

import drizzleAutumn from './drizzle/autumn.js'

/** @type {Record<string, Record<string, { module: Record<string, unknown>, temps: string[] }>>} */
const BRANCHES = {
  drizzle: {
    autumn: {
      module: drizzleAutumn,
      // cold + mild stay on legacy (_library-autumn-drizzle + _theme).
      temps: ['warm', 'hot'],
    },
  },
}

/**
 * @param {string} weather
 * @param {string} season
 * @returns {Record<string, unknown> | null}
 */
export function getSeasonModule(weather, season) {
  return BRANCHES[weather]?.[season]?.module ?? null
}

/**
 * @param {string} sceneId — weather--season--time--temp
 * @returns {boolean}
 */
export function isSceneV2(sceneId) {
  const parts = sceneId?.split('--')
  if (!parts || parts.length !== 4) return false
  const [weather, season, _time, temp] = parts
  const entry = BRANCHES[weather]?.[season]
  if (!entry) return false
  return entry.temps.includes(temp)
}
