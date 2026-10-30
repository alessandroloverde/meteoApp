/**
 * Flatten a resolved scene pack (base ∪ time) into CSS custom properties
 * consumed by `pages/index.vue`. Same variable names as paint emit + theme
 * so DevTools inspector workflow stays unchanged.
 *
 * @param {Record<string, unknown>} pack — output of resolveScenePack
 * @returns {Record<string, string>}
 */
export function emitSceneCssVars(pack) {
  if (!pack || typeof pack !== 'object') return {}

  /** @type {Record<string, string>} */
  const vars = {}

  emitTerrain(pack.terrain, vars)
  emitBush(pack.bush, vars)
  emitFoliage(pack.foliage, vars)
  emitTrunks(pack.trunks, vars)
  emitBuildings(pack.buildings, vars)
  emitSky(pack.sky, vars)
  emitMoon(pack.moon, vars)
  emitSunGlow(pack.sunGlow, vars)
  emitClouds(pack.clouds, vars)
  emitSmallClouds(pack.smallClouds, vars)
  emitOverlays(pack.overlays, vars)
  emitGrade(pack._resolvedGrade, vars)

  return vars
}

function set(vars, name, value) {
  if (value == null || value === '') return
  vars[name] = String(value)
}

function emitTerrain(terrain, vars) {
  if (!terrain) return
  for (const [n, layer] of Object.entries(terrain)) {
    if (!layer || typeof layer !== 'object') continue
    for (const [slot, val] of Object.entries(layer)) {
      if (slot === 'blend') set(vars, `--terrain-${n}-blend`, val)
      else set(vars, `--terrain-${n}-${slot}`, val)
    }
  }
}

function emitBush(bush, vars) {
  if (!bush) return
  for (const [n, val] of Object.entries(bush)) {
    if (typeof val === 'string') {
      // Legacy full-gradient string
      set(vars, `--bush-${n}-bg`, val)
    } else if (val && typeof val === 'object') {
      if (val.a != null) set(vars, `--bush-${n}-a`, val.a)
      if (val.b != null) set(vars, `--bush-${n}-b`, val.b)
      // Optional full override (rare; prefer a/b)
      if (val.gradient) set(vars, `--bush-${n}-bg`, val.gradient)
    }
  }
}

function emitFoliage(foliage, vars) {
  if (!foliage) return
  for (const [n, val] of Object.entries(foliage)) {
    if (typeof val === 'string') {
      // Legacy full-gradient string
      set(vars, `--foliage-${n}-bg`, val)
    } else if (val && typeof val === 'object') {
      if (val.a != null) set(vars, `--foliage-${n}-a`, val.a)
      if (val.b != null) set(vars, `--foliage-${n}-b`, val.b)
      // Optional full override (rare; prefer a/b)
      if (val.gradient) set(vars, `--foliage-${n}-bg`, val.gradient)
    }
  }
}

function emitTrunks(trunks, vars) {
  if (!trunks) return
  const a = trunks.a
  const b = trunks.b
  // Shared stops (inspector: --trunk-a / --trunk-b); also fan out to 1–5 for tree rules.
  if (a != null) {
    set(vars, '--trunk-a', a)
    set(vars, '--trunk-base', trunks.base ?? a)
    for (let i = 1; i <= 5; i++) set(vars, `--trunk-${i}-a`, a)
  } else if (trunks.base) {
    set(vars, '--trunk-base', trunks.base)
  }
  if (b != null) {
    set(vars, '--trunk-b', b)
    for (let i = 1; i <= 5; i++) set(vars, `--trunk-${i}-b`, b)
  }
  // Per-trunk overrides (optional)
  for (const [key, val] of Object.entries(trunks)) {
    if (key === 'base' || key === 'a' || key === 'b') continue
    if (val && typeof val === 'object') {
      if (val.a != null) set(vars, `--trunk-${key}-a`, val.a)
      if (val.b != null) set(vars, `--trunk-${key}-b`, val.b)
    }
  }
}

function emitBuildings(buildings, vars) {
  if (!buildings) return
  if (buildings.wall != null) set(vars, '--building-wall-base', buildings.wall)
  if (buildings.roof != null) set(vars, '--building-roof-base', buildings.roof)
  if (buildings.window != null) set(vars, '--building-window-base', buildings.window)
  if (buildings.windowOpacity != null) set(vars, '--building-window-opacity', buildings.windowOpacity)
  if (buildings.windowGlowFilter != null) {
    set(vars, '--building-window-glow-filter', buildings.windowGlowFilter)
  }
  if (buildings.church != null) set(vars, '--building-church', buildings.church)
}

function emitSky(sky, vars) {
  if (!sky) return
  // V2: set --sky-stop-* only. Geometry comes from `.scene[data-scene-v2]`
  // radial-gradient(… var(--sky-stop-N) …). Optional sky.gradient overrides that shell.
  if (sky.gradient) set(vars, '--sky-gradient', sky.gradient)
  if (sky.stops && typeof sky.stops === 'object') {
    for (const [i, color] of Object.entries(sky.stops)) {
      set(vars, `--sky-stop-${i}`, color)
    }
  }
  const overlay = sky.overlay
  if (overlay) {
    if (overlay.blend) set(vars, '--sky-overlay-blend', overlay.blend)
    if (overlay.opacity != null) set(vars, '--sky-overlay-opacity', overlay.opacity)
    if (Array.isArray(overlay.stops)) {
      overlay.stops.forEach((color, i) => set(vars, `--sky-overlay-stop-${i}`, color))
    }
    if (overlay.bg) set(vars, '--sky-overlay-bg', overlay.bg)
  }
}

function emitMoon(moon, vars) {
  if (!moon) return
  if (moon.top != null) set(vars, '--moon-top', moon.top)
  if (moon.left != null) set(vars, '--moon-left', moon.left)
  if (moon.opacity != null) set(vars, '--moon-opacity', moon.opacity)
  if (moon.filter) set(vars, '--moon-filter', moon.filter)
}

function emitSunGlow(sunGlow, vars) {
  if (!sunGlow) return
  if (sunGlow.color0) set(vars, '--sun-glow-color-0', sunGlow.color0)
  if (sunGlow.color1) set(vars, '--sun-glow-color-1', sunGlow.color1)
  if (sunGlow.opacity != null) set(vars, '--sun-glow-opacity', sunGlow.opacity)
  if (sunGlow.blend) set(vars, '--sun-glow-blend', sunGlow.blend)
}

function emitClouds(clouds, vars) {
  if (!clouds) return
  const bottom = clouds.bottom
  if (bottom) {
    if (bottom.opacity != null) set(vars, '--bottom-clouds-opacity', bottom.opacity)
    const ov = bottom.overlay
    if (ov) {
      if (ov.color) set(vars, '--cloud-bottom-overlay-color', ov.color)
      if (ov.opacity != null) set(vars, '--cloud-bottom-overlay-opacity', ov.opacity)
      if (ov.blend) set(vars, '--cloud-bottom-overlay-blend', ov.blend)
    }
  }
  const topOverlay = clouds.topOverlay
  if (topOverlay) {
    if (topOverlay.color) set(vars, '--cloud-top-overlay-color', topOverlay.color)
    if (topOverlay.opacity != null) set(vars, '--cloud-top-overlay-opacity', topOverlay.opacity)
    if (topOverlay.blend) set(vars, '--cloud-top-overlay-blend', topOverlay.blend)
  }
}

function emitSmallClouds(smallClouds, vars) {
  if (!smallClouds) return
  for (const [n, layer] of Object.entries(smallClouds)) {
    if (!layer || typeof layer !== 'object') continue
    if (layer.a != null) set(vars, `--small-cloud-${n}-a`, layer.a)
    if (layer.b != null) set(vars, `--small-cloud-${n}-b`, layer.b)
    if (layer.c != null) set(vars, `--small-cloud-${n}-c`, layer.c)
  }
}

function emitOverlays(overlays, vars) {
  if (!overlays) return
  emitOverlayGroup('terrain', overlays.terrain, vars)
  emitOverlayGroup('bush', overlays.bush, vars)
  emitOverlayGroup('foliage', overlays.foliage, vars)
}

function emitOverlayGroup(prefix, overlay, vars) {
  if (!overlay) return
  if (overlay.color) set(vars, `--${prefix}-overlay-color`, overlay.color)
  if (overlay.bg) set(vars, `--${prefix}-overlay-bg`, overlay.bg)
  if (overlay.opacity != null) set(vars, `--${prefix}-overlay-opacity`, overlay.opacity)
  if (overlay.blend) set(vars, `--${prefix}-overlay-blend`, overlay.blend)
  if (overlay.filter) set(vars, `--${prefix}-overlay-filter`, overlay.filter)
}

/**
 * V2 grades target a pane via `grade.pane`:
 *   'color' | 'soft-haze' (default) | 'night' | 'evening'
 * Night/evening panes are still time-gated in CSS for legacy; prefer soft-haze
 * or color for freeform v2 grades unless you intend that gate.
 */
function emitGrade(grade, vars) {
  if (!grade) return
  const pane = grade.pane || 'soft-haze'
  const prefix =
    pane === 'color'
      ? 'scene-grade-color'
      : pane === 'night'
        ? 'scene-grade-night'
        : pane === 'evening'
          ? 'scene-grade-evening'
          : 'scene-grade-soft-haze'

  if (grade.bg) set(vars, `--${prefix}-bg`, grade.bg)
  if (grade.opacity != null) set(vars, `--${prefix}-opacity`, grade.opacity)
  if (grade.blend) set(vars, `--${prefix}-blend`, grade.blend)
  if (grade.filter) set(vars, `--${prefix}-filter`, grade.filter)
  if (pane === 'night') set(vars, '--scene-grade-night-enabled', 1)
  if (pane === 'evening') set(vars, '--scene-grade-evening-enabled', 1)
}
