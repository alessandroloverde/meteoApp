# Scene authoring (v2)

Weather → season → **temperature** → time.

## Dual-run

| Path | When |
|------|------|
| **Legacy** — `assets/scss/paint/` + `_theme.scss` | Temps **not** listed in `registry.js` |
| **V2** — `scenes/<weather>/<season>.js` | Temps listed in `registry.js` |

Finished bands (e.g. drizzle autumn cold/mild) stay legacy until you port them.

## Temp pack shape

```js
mild: {
  base: {
    terrain, bush, foliage, trunks, buildings,
    grades: { haze: { bg, opacity, blend } },  // menu for this temp
  },
  morning:   { sky, clouds, moon, sunGlow, overlays?, grade?, /* sparse overrides */ },
  afternoon: { … },
  evening:   { … },
  night:     { … },
}
```

- **`base`** — shared object colors for the temp band.
- **Time leaf** — lighting + optional sparse recolors and/or overlays.
- **`grade`** — string key into `base.grades`, inline `{ bg, opacity, blend }`, or omit.
- Resolved look = `deepMerge(base, timeLeaf)` → CSS vars on `.scene`.

## Sky (v2)

Geometry is fixed on `.scene[data-scene-v2]`:

```css
--sky-gradient: radial-gradient(
  circle farthest-corner at 50% 90%,
  var(--sky-stop-0)  0%,
  var(--sky-stop-1) 40%,
  var(--sky-stop-2) 70%,
  var(--sky-stop-3) 100%
);
```

Author the **stops** on the time leaf (same tokens as before):

```js
sky: {
  stops: { 0: '#…', 1: '#…', 2: '#…', 3: '#…' },
},
```

Inspector: edit `--sky-stop-0` … `--sky-stop-3` on `.scene`, paste into `sky.stops`.  
(Legacy scenes keep the linear shell composed from the same stop tokens.)

## Inspector workflow

1. Register the temp in `scenes/registry.js`.
2. Select the scene in SceneControls.
3. Edit `--terrain-*`, `--bush-*`, `--sky-gradient`, … in DevTools.
4. Paste winners into `base` or the time leaf in the season module.

Emitted names match the existing paint/theme tokens (plus `--bottom-clouds-opacity`).

Terrain live tokens: **1** → `a` / `c` / `d` (+ optional `blend`); **2–5** → `a` / `b`.

Bushes: **`--bush-N-a` / `--bush-N-b`** only (geometry fixed in `index.vue`).

Foliage: **`--foliage-N-a` / `--foliage-N-b`** only (geometry fixed in `index.vue`).

## Overlays vs recolors

Per time leaf, choose:

- **Recolor** — override `terrain` / `bush` / `foliage` / `buildings`
- **Overlay** — set `overlays.terrain` (etc.) and leave base colors
- **Neither** — sky/clouds/moon only

## Grades

Defined on **temp `base.grades`**. Each time picks one or none. V2 emits the chosen grade into the **soft-haze** pane (always on; not night/evening-gated). Legacy night/evening grade rules in `_theme.scss` stay for old scenes.
