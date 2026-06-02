import { parseSceneIdentifier } from './sceneIdentifier'

/**
 * Per-scene paint overrides: non-default variant for a specific scene id.
 * When absent, scenes fall back to `default` for their season + weather
 * if that branch exists in `PAINT_LIBRARY_BRANCHES`.
 */

/** @typedef {{ season: string, weather: string, variant: string }} ScenePaintEntry */

/**
 * Season + weather pairs that have a `default` bundle in `assets/scss/paint/`.
 * Keep in sync when adding new library files (e.g. `_library-winter-snow.scss`).
 */
export const PAINT_LIBRARY_BRANCHES = [
  { season: 'autumn', weather: 'cloudy' },
]

/** @type {Record<string, ScenePaintEntry>} */
export const SCENE_PAINT = {
  // Example override when a scene needs more than the shared default:
  // 'cloudy--autumn--morning--mild': { season: 'autumn', weather: 'cloudy', variant: 'morning-lit' },
}

function hasPaintLibraryBranch(season, weather) {
  return PAINT_LIBRARY_BRANCHES.some(
    (branch) => branch.season === season && branch.weather === weather,
  )
}

export function buildPaintBundleId(season, weather, variant) {
  return `${season}--${weather}--${variant}`
}

/**
 * @param {string} sceneId — weather--season--time--temp
 * @returns {string | null} e.g. `autumn--cloudy--default`
 */
export function resolveScenePaintBundle(sceneId) {
  const override = SCENE_PAINT[sceneId]
  if (override) {
    return buildPaintBundleId(override.season, override.weather, override.variant)
  }

  const axes = parseSceneIdentifier(sceneId)
  if (!axes) return null

  if (hasPaintLibraryBranch(axes.season, axes.weather)) {
    return buildPaintBundleId(axes.season, axes.weather, 'default')
  }

  return null
}

/**
 * @param {string} sceneId
 * @returns {ScenePaintEntry | null}
 */
export function getScenePaintEntry(sceneId) {
  const override = SCENE_PAINT[sceneId]
  if (override) return override

  const axes = parseSceneIdentifier(sceneId)
  if (!axes || !hasPaintLibraryBranch(axes.season, axes.weather)) return null

  return { season: axes.season, weather: axes.weather, variant: 'default' }
}
