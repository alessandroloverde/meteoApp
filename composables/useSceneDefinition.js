import { computed, watch } from 'vue'
import { resolveScenePack, isSceneV2 } from '@/utils/sceneResolve'
import { emitSceneCssVars } from '@/utils/sceneEmit'

/**
 * V2 scene definition → inline CSS variables for `.scene`.
 * Returns empty vars / not-v2 when the scene is still on the legacy path.
 *
 * @param {import('vue').Ref<string> | (() => string) | string} sceneIdRef
 */
export function useSceneDefinition(sceneIdRef) {
  const resolveId = () =>
    typeof sceneIdRef === 'function' ? sceneIdRef() : sceneIdRef?.value ?? sceneIdRef

  const isV2 = computed(() => isSceneV2(resolveId()))

  const cssVars = computed(() => {
    const id = resolveId()
    if (!isSceneV2(id)) return {}
    const pack = resolveScenePack(id)
    if (!pack) return {}
    return emitSceneCssVars(pack)
  })

  if (import.meta.client) {
    watch(
      () => resolveId(),
      (id) => {
        if (id && isSceneV2(id)) {
          console.info(`[scene-v2] "${id}" — definition path`)
        }
      },
    )
  }

  return { isV2, cssVars }
}
