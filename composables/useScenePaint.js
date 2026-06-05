import { computed, watch } from 'vue'
import { resolveScenePaintBundles } from '@/utils/scenePaint'

/**
 * Resolves per-cluster paint bundles (`data-paint-sky` / `data-paint-terrain`)
 * for the current scene id. Autumn + cloudy (and other `PAINT_LIBRARY_BRANCHES`)
 * use `default` automatically. Returns null when no library branch exists
 * (gray :root paint stubs).
 *
 * @returns {{ paintBundles: import('vue').ComputedRef<{ sky: string, terrain: string } | null> }}
 */
export function useScenePaint(sceneIdRef) {
  const resolveId = () =>
    typeof sceneIdRef === 'function' ? sceneIdRef() : sceneIdRef?.value ?? sceneIdRef

  const paintBundles = computed(() => resolveScenePaintBundles(resolveId()) ?? null)

  if (import.meta.client) {
    watch(paintBundles, (bundles) => {
      const id = resolveId()
      if (id && bundles == null) {
        console.warn(`[scene-paint] No paint library for "${id}" — using gray stubs.`)
      }
    })
  }

  return { paintBundles }
}
