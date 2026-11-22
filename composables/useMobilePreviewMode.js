// Mobile preview mode — hides the two-phone authoring harness (reference
// image + SceneControls + PhoneViewportSelect) and renders the app
// full-bleed, like it would ship. Lets you test on a real phone over
// LAN/tunnel without the dev chrome.
//
// Named `useMobilePreviewMode` (not `usePreviewMode`) to avoid colliding
// with Nuxt's built-in `usePreviewMode` (content/Nuxt Studio draft preview).
//
// Resolution order:
//   1. User override ('on' / 'off') — set from <Settings>, wins always.
//   2. 'auto' — heuristic device detection (touch + narrow viewport) run by
//      `plugins/preview-mode.client.js` on load.
//
// Persisted via `usePreviewModeStorage` (key: `meteo-preview-mode`).
// `?preview=1` / `?preview=0` in the URL sets the override for the current
// session only (not persisted) — handled by the same plugin.

import { savePreviewModeOverride } from '@/composables/usePreviewModeStorage'

export const PREVIEW_MODE_OPTIONS = ['auto', 'on', 'off']

export function useMobilePreviewMode() {
  /** @type {import('vue').Ref<'auto' | 'on' | 'off'>} */
  const override = useState('mobile-preview-override', () => 'auto')
  /** Heuristic result — only consulted when `override === 'auto'`. */
  const detected = useState('mobile-preview-detected', () => false)

  const isPreview = computed(() => {
    if (override.value === 'on') return true
    if (override.value === 'off') return false
    return detected.value
  })

  /** Settings-driven change — persists to localStorage. */
  function setOverride(value) {
    if (!PREVIEW_MODE_OPTIONS.includes(value)) return
    override.value = value
    savePreviewModeOverride(value)
  }

  return {
    override,
    detected,
    isPreview,
    setOverride,
  }
}
