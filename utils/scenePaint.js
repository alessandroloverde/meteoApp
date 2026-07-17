import { parseSceneIdentifier } from './sceneIdentifier'

/**
 * Paint resolution model (see also `assets/scss/paint/` and `_theme.scss`):
 *
 *   1. Library branch (season + weather) — base sky + terrain `default` in SCSS
 *   2. Terrain variant — season + weather + temp → data-paint-terrain bundle
 *   3. Sky variant — branch default; sparse per-scene overrides when needed
 *   4. Time + temp finishing — block overlays + global grades via data-scene-id
 *
 * Clusters:
 *   • sky      — sky gradient + clouds      → data-paint-sky
 *   • terrain  — terrain, trunks, foliage,
 *                bushes, buildings          → data-paint-terrain
 *
 * Re-enable branches in PAINT_LIBRARY_BRANCHES as each season+weather pair is authored.
 */

/** @typedef {{ sky?: string, terrain?: string }} ScenePaintOverride */
/** @typedef {{ sky: string, terrain: string }} ScenePaintBundles */

/**
 * Season + weather pairs that have a paint library in `assets/scss/paint/`.
 * Keep in sync when adding new library files (e.g. `_library-winter-snow.scss`).
 */
export const PAINT_LIBRARY_BRANCHES = [
  { season: 'autumn', weather: 'cloudy' },
  { season: 'spring', weather: 'cloudy' },
  { season: 'summer', weather: 'cloudy' },
  { season: 'winter', weather: 'cloudy' },
]

export const PAINT_CLUSTERS = ['sky', 'terrain']

/**
 * Sparse per-scene overrides (full scene id). Only scenes that differ from
 * branch + temp rules. Terrain usually comes from TERRAIN_VARIANT_BY_TEMP.
 *
 * @type {Record<string, ScenePaintOverride>}
 */
export const SCENE_PAINT_OVERRIDES = {}

/**
 * Terrain variant key per temperature band. Omitted temps fall back to `default`.
 *
 * @type {Record<string, Record<string, Record<string, string>>>}
 */
const TERRAIN_VARIANT_BY_TEMP = {
  autumn: {
    cloudy: {
      frosty: 'frosty',
      cold: 'cold',
      mild: 'mild',
      warm: 'warm',
      hot: 'hot',
    },
  },
  spring: {
    cloudy: {
      frosty: 'frosty',
      cold: 'cold',
      mild: 'mild',
      warm: 'warm',
      hot: 'hot',
    },
  },
  summer: {
    cloudy: {
      cold: 'cold',
      warm: 'warm',
      hot: 'hot',
    },
  },
  winter: {
    cloudy: {
      mild: 'mild',
    },
  },
}

/**
 * Sky variant per library branch (season + weather).
 *
 * @type {Record<string, Record<string, string>>}
 */
const SKY_VARIANT_BY_BRANCH = {
  autumn: {
    cloudy: 'default',
  },
  spring: {
    cloudy: 'default',
  },
  summer: {
    cloudy: 'default',
  },
  winter: {
    cloudy: 'default',
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
 * @param {string} season
 * @param {string} weather
 * @param {string} temp
 * @returns {string} variant key (`default`, `mild`, `warm`, …)
 */
export function resolveTerrainPaintVariant(season, weather, temp) {
  return TERRAIN_VARIANT_BY_TEMP[season]?.[weather]?.[temp] ?? 'default'
}

/**
 * @param {string} season
 * @param {string} weather
 * @param {ScenePaintOverride | undefined} sceneOverride
 * @returns {string} variant key
 */
export function resolveSkyPaintVariant(season, weather, sceneOverride) {
  if (sceneOverride?.sky) return sceneOverride.sky
  return SKY_VARIANT_BY_BRANCH[season]?.[weather] ?? 'default'
}

/**
 * @param {string} sceneId — weather--season--time--temp
 * @returns {ScenePaintBundles | null} per-cluster bundle ids, or null when no library branch
 */
export function resolveScenePaintBundles(sceneId) {
  const axes = parseSceneIdentifier(sceneId)
  if (!axes || !hasPaintLibraryBranch(axes.season, axes.weather)) return null

  const override = SCENE_PAINT_OVERRIDES[sceneId]

  const skyVariant = resolveSkyPaintVariant(axes.season, axes.weather, override)
  const terrainVariant =
    override?.terrain ?? resolveTerrainPaintVariant(axes.season, axes.weather, axes.temp)

  return {
    sky: buildPaintBundleId(axes.season, axes.weather, skyVariant),
    terrain: buildPaintBundleId(axes.season, axes.weather, terrainVariant),
  }
}
