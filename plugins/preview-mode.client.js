import { loadPreviewModeOverride } from '@/composables/usePreviewModeStorage'
import { PREVIEW_MODE_OPTIONS, useMobilePreviewMode } from '@/composables/useMobilePreviewMode'

// Note: <Settings> and <layouts/default> read/write the same state via
// `useMobilePreviewMode()` directly (it's a shared `useState`) — this plugin
// only seeds the initial value on load, no provide/inject needed.

/** Real touch phones: coarse pointer + no hover + narrow viewport. Desktop
 * (even resized) keeps `pointer: fine`; DevTools device-emulation spoofs the
 * same signals on purpose, so it's treated as "a phone" too — that's fine. */
function detectRealPhone() {
  if (typeof window === 'undefined' || !window.matchMedia) return false

  const coarse = window.matchMedia('(pointer: coarse)').matches
  const noHover = window.matchMedia('(hover: none)').matches
  const narrow = window.innerWidth <= 480

  return coarse && noHover && narrow
}

export default defineNuxtPlugin(() => {
  const { override, detected } = useMobilePreviewMode()

  // 1. Restore the persisted override (defaults to 'auto' if never set).
  const saved = loadPreviewModeOverride()
  if (saved) override.value = saved

  // 2. `?preview=1` / `?preview=0` — session-only override, doesn't persist.
  const params = new URLSearchParams(window.location.search)
  const queryPreview = params.get('preview')
  if (queryPreview === '1' || queryPreview === 'true') override.value = 'on'
  else if (queryPreview === '0' || queryPreview === 'false') override.value = 'off'
  else if (PREVIEW_MODE_OPTIONS.includes(queryPreview)) override.value = queryPreview

  // 3. Heuristic device detection — only matters while override is 'auto'.
  function updateDetected() {
    detected.value = detectRealPhone()
  }
  updateDetected()
  window.addEventListener('resize', updateDetected, { passive: true })
  window.addEventListener('orientationchange', updateDetected)
})
