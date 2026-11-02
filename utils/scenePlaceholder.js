import { parseSceneIdentifier } from './sceneIdentifier'
import { isSceneV2 } from '@/scenes/registry'
import { resolveScenePaintBundles } from './scenePaint'

/**
 * Mid-tone oklch per temperature band. Placeholder gradient keeps the same
 * C/H and lightens L at the top / darkens at the bottom.
 *
 * @type {Record<string, { l: number, c: number, h: number }>}
 */
const TEMP_OKLCH = {
  frosty: { l: 0.62, c: 0.055, h: 230 },
  cold: { l: 0.58, c: 0.07, h: 250 },
  mild: { l: 0.58, c: 0.065, h: 150 },
  warm: { l: 0.62, c: 0.09, h: 70 },
  hot: { l: 0.6, c: 0.11, h: 40 },
}

const L_DELTA = 0.18

/**
 * Authored = v2 registry temp, or legacy paint library for that season+weather.
 *
 * @param {string} sceneId — weather--season--time--temp
 * @returns {boolean}
 */
export function isSceneAuthored(sceneId) {
  if (!sceneId) return false
  if (isSceneV2(sceneId)) return true
  return resolveScenePaintBundles(sceneId) != null
}

/**
 * @param {string} temp — frosty | cold | mild | warm | hot
 * @returns {string} CSS linear-gradient (lighter top → darker bottom)
 */
export function scenePlaceholderBackground(temp) {
  const t = TEMP_OKLCH[temp] ?? TEMP_OKLCH.mild
  const topL = Math.min(0.92, t.l + L_DELTA)
  const bottomL = Math.max(0.2, t.l - L_DELTA)
  const top = `oklch(${topL.toFixed(3)} ${t.c} ${t.h})`
  const bottom = `oklch(${bottomL.toFixed(3)} ${t.c} ${t.h})`
  return `linear-gradient(to bottom, ${top}, ${bottom})`
}

/**
 * @param {string} sceneId
 * @returns {{ authored: boolean, background: string, temp: string | null }}
 */
export function resolveScenePlaceholder(sceneId) {
  const axes = parseSceneIdentifier(sceneId)
  const temp = axes?.temp ?? 'mild'
  const authored = isSceneAuthored(sceneId)
  return {
    authored,
    temp,
    background: authored ? '' : scenePlaceholderBackground(temp),
  }
}
