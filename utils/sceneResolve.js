import { parseSceneIdentifier } from './sceneIdentifier'
import { deepMerge } from './sceneDeepMerge'
import { getSeasonModule, isSceneV2 } from '@/scenes/registry'

/**
 * Resolve a scene id against the v2 authoring tree.
 * Returns null when the scene is still on the legacy paint + _theme path.
 *
 * @param {string} sceneId — weather--season--time--temp
 * @returns {Record<string, unknown> | null}
 */
export function resolveScenePack(sceneId) {
  if (!isSceneV2(sceneId)) return null

  const axes = parseSceneIdentifier(sceneId)
  if (!axes) return null

  const seasonMod = getSeasonModule(axes.weather, axes.season)
  if (!seasonMod) return null

  const tempPack = seasonMod[axes.temp]
  if (!tempPack || typeof tempPack !== 'object') return null

  const base = tempPack.base && typeof tempPack.base === 'object' ? tempPack.base : {}
  const timeLeaf =
    tempPack[axes.time] && typeof tempPack[axes.time] === 'object' ? tempPack[axes.time] : {}

  const merged = deepMerge(base, timeLeaf)

  // Resolve grade: time.grade is a key into base.grades, or null/omit = none.
  // Inline grade objects on the time leaf are also allowed (one-offs).
  const grades = base.grades && typeof base.grades === 'object' ? base.grades : {}
  const gradeRef = timeLeaf.grade
  let resolvedGrade = null
  if (typeof gradeRef === 'string' && grades[gradeRef]) {
    resolvedGrade = grades[gradeRef]
  } else if (gradeRef && typeof gradeRef === 'object') {
    resolvedGrade = gradeRef
  }

  // Don't leak the grades catalog or grade key onto CSS emit
  const { grades: _grades, grade: _grade, ...rest } = merged
  return {
    ...rest,
    _resolvedGrade: resolvedGrade,
  }
}

export { isSceneV2 }
