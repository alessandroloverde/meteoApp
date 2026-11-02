import { computed } from 'vue'
import { resolveScenePlaceholder } from '@/utils/scenePlaceholder'

/**
 * Missing-scene fallback: temp-tinted oklch vertical gradient + scene id label.
 *
 * @param {import('vue').Ref<string> | (() => string) | string} sceneIdRef
 */
export function useScenePlaceholder(sceneIdRef) {
  const resolveId = () =>
    typeof sceneIdRef === 'function' ? sceneIdRef() : sceneIdRef?.value ?? sceneIdRef

  const state = computed(() => resolveScenePlaceholder(resolveId()))

  const isPlaceholder = computed(() => !state.value.authored)
  const background = computed(() => state.value.background)

  return { isPlaceholder, background }
}
