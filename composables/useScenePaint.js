import { computed, watch } from 'vue'
import { resolveScenePaintBundle } from '@/utils/scenePaint'

/**
 * Resolves `data-paint-bundle` for the current scene id.
 * Autumn + cloudy (and other `PAINT_LIBRARY_BRANCHES`) use `default` automatically.
 * Returns null when no library branch exists (gray :root paint stubs).
 */
export function useScenePaint(sceneIdRef) {
  const paintBundle = computed(() => {
    const id = typeof sceneIdRef === 'function' ? sceneIdRef() : sceneIdRef?.value ?? sceneIdRef
    return resolveScenePaintBundle(id) ?? null
  })

  if (import.meta.client) {
    watch(paintBundle, (bundle) => {
      const id = typeof sceneIdRef === 'function' ? sceneIdRef() : sceneIdRef?.value ?? sceneIdRef
      if (id && bundle == null) {
        console.warn(`[scene-paint] No paint library for "${id}" — using gray stubs.`)
      }
    })
  }

  return { paintBundle }
}
