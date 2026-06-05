import { parseSceneIdentifier } from './sceneIdentifier'

/**
 * Paint variants are selected independently per cluster:
 *   • sky      — sky gradient + clouds      → data-paint-sky
 *   • terrain  — terrain, trunks, foliage,
 *                bushes, buildings          → data-paint-terrain
 *
 * A scene may mix clusters (e.g. sky `variant-1` + terrain `default`).
 * Omitted clusters fall back to `default`. Variant names are placeholders and
 * will be renamed later.
 */

/** @typedef {{ season: string, weather: string, sky?: string, terrain?: string }} ScenePaintEntry */
/** @typedef {{ sky: string, terrain: string }} ScenePaintBundles */

/**
 * Season + weather pairs that have a paint library in `assets/scss/paint/`.
 * Keep in sync when adding new library files (e.g. `_library-winter-snow.scss`).
 */
export const PAINT_LIBRARY_BRANCHES = [
  { season: 'autumn', weather: 'cloudy' },
]

export const PAINT_CLUSTERS = ['sky', 'terrain']

/** @type {Record<string, ScenePaintEntry>} */
export const SCENE_PAINT = {
  // sky + terrain both on variant-1 for the afternoon reference.
  // Other Autumn–Cloudy combos keep `default` for both clusters.
  'cloudy--autumn--afternoon--mild': {
    season: 'autumn',
    weather: 'cloudy',
    sky: 'variant-1',
    terrain: 'variant-1',
  },
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
 * @returns {ScenePaintBundles | null} per-cluster bundle ids, or null when no library branch
 */
export function resolveScenePaintBundles(sceneId) {
  const override = SCENE_PAINT[sceneId]
  if (override) {
    return {
      sky: buildPaintBundleId(override.season, override.weather, override.sky ?? 'default'),
      terrain: buildPaintBundleId(override.season, override.weather, override.terrain ?? 'default'),
    }
  }

  const axes = parseSceneIdentifier(sceneId)
  if (!axes || !hasPaintLibraryBranch(axes.season, axes.weather)) return null

  return {
    sky: buildPaintBundleId(axes.season, axes.weather, 'default'),
    terrain: buildPaintBundleId(axes.season, axes.weather, 'default'),
  }
}
