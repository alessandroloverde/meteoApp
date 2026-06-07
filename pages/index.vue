<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useWeatherStore } from '@/stores/weather.store'
import { useLocation } from '@/composables/useLocation'
import { fetchWeather } from '@/composables/useWeather'
import { mapWeatherToUI } from '@/utils/weatherMapper'
import { buildSceneIdentifier } from '@/utils/sceneIdentifier'
import { reverseGeocode } from '@/composables/useReverseGeocoding'

const store = useWeatherStore()
const { getLocation } = useLocation()

async function loadWeather(lat, lon) {
  const weather = await fetchWeather(lat, lon)
  
  store.setWeather(weather)
}

onMounted(async () => {
  try {
    store.setLoading(true)

    const hasSaved = store.loadSavedLocation()

    if (hasSaved && store.coords) {
      await loadWeather(store.coords.latitude, store.coords.longitude)
    } else {
      const coords = await getLocation()

      store.setGPS(coords)

      await loadWeather(coords.latitude, coords.longitude)

      const location = await reverseGeocode(coords.latitude, coords.longitude)

      store.city = location.city
      store.country = location.country
    }
  } catch (err) {
    store.setError(err.message)
  } finally {
    store.setLoading(false)
  }
})

const ui = computed(() => {
  if (!store.weather) return null

  return mapWeatherToUI(store.weather)
})

// Dev/test theming knobs — driven by <SceneControls> in the layout.
// Replace these bindings with the live `ui.*` values when wiring real data.
const { season: sceneSeason, time: sceneTime, weather: sceneWeather, temp: sceneTemp } = useSceneControls()

// Scene `data-*` attributes drive a large subtree of masks, filters, and CSS vars.
// Updating them in the same frame as a native <select> change hurts INP. Mirror
// shared `useState` into these refs on the next animation frame (client only).
const sceneDisplaySeason = ref(sceneSeason.value)
const sceneDisplayTime = ref(sceneTime.value)
const sceneDisplayWeather = ref(sceneWeather.value)
const sceneDisplayTemp = ref(sceneTemp.value)

function flushSceneDisplayAttrs() {
  sceneDisplaySeason.value = sceneSeason.value
  sceneDisplayTime.value = sceneTime.value
  sceneDisplayWeather.value = sceneWeather.value
  sceneDisplayTemp.value = sceneTemp.value
}

let sceneAttrRaf = null
function queueSceneDisplayAttrs() {
  if (import.meta.server) {
    flushSceneDisplayAttrs()
    return
  }
  if (sceneAttrRaf != null) return
  sceneAttrRaf = requestAnimationFrame(() => {
    sceneAttrRaf = null
    flushSceneDisplayAttrs()
  })
}

watch([sceneSeason, sceneTime, sceneWeather, sceneTemp], queueSceneDisplayAttrs, { flush: 'post' })

// Single key for combo-specific SCSS / assets: weather--season--time--temp
const sceneDisplayId = computed(() =>
  buildSceneIdentifier({
    weather: sceneDisplayWeather.value,
    season: sceneDisplaySeason.value,
    time: sceneDisplayTime.value,
    temp: sceneDisplayTemp.value,
  }),
)

const { paintBundles: scenePaint } = useScenePaint(sceneDisplayId)

onBeforeUnmount(() => {
  if (sceneAttrRaf != null) {
    cancelAnimationFrame(sceneAttrRaf)
    sceneAttrRaf = null
  }
})

</script>

<template>
  <div class="page-bg">
    <!--
      Scene: four axes on `.scene` plus `data-scene-id` (weather--season--time--temp).
      Dev panel: SceneControls. For live API, bind axes from `ui` / `buildSceneIdentifier`.
    -->
    <div
      class="scene"
      :data-scene-id="sceneDisplayId"
      :data-paint-sky="scenePaint?.sky ?? undefined"
      :data-paint-terrain="scenePaint?.terrain ?? undefined"
      :data-season="sceneDisplaySeason"
      :data-time="sceneDisplayTime"
      :data-weather="sceneDisplayWeather"
      :data-temp="sceneDisplayTemp"
    >
      <!--
        SKY — gradient base + sun glow + moon/sun disc + clouds.
        The overlay container sits above the gradient and below the clouds.
      -->
      <div class="scene-layer sky-base">

        <!-- Sun glow (radial halo behind disc, tracks --moon-* position) -->
        <div class="sky-sun-glow" aria-hidden="true"></div>

        <!-- Sky overlays: season → time → temp → weather -->
        <aside class="sky-overlays" aria-hidden="true">
          <div class="sky-overlays__season"></div>
          <div class="sky-overlays__time"></div>
          <div class="sky-overlays__temp"></div>
          <div class="sky-overlays__weather"></div>
        </aside>

        <!-- Moon / sun disc -->
        <div class="scene-layer moon"></div>

        <!-- Top clouds + their overlays -->
        <section class="top-clouds">
          <div class="cloud-1-wrap">
            <div class="scene-layer cloud-1">
              <div class="cloud-overlays__season"></div>
              <div class="cloud-overlays__time"></div>
              <div class="cloud-overlays__temp"></div>
              <div class="cloud-overlays__weather"></div>
            </div>
          </div>
          <div class="scene-layer cloud-2">
            <div class="cloud-overlays__season"></div>
            <div class="cloud-overlays__time"></div>
            <div class="cloud-overlays__temp"></div>
            <div class="cloud-overlays__weather"></div>
          </div>
          <div class="scene-layer cloud-3">
            <div class="cloud-overlays__season"></div>
            <div class="cloud-overlays__time"></div>
            <div class="cloud-overlays__temp"></div>
            <div class="cloud-overlays__weather"></div>
          </div>
          <div class="scene-layer cloud-4">
            <div class="cloud-overlays__season"></div>
            <div class="cloud-overlays__time"></div>
            <div class="cloud-overlays__temp"></div>
            <div class="cloud-overlays__weather"></div>
          </div>
        </section>

        <!-- Bottom clouds + their overlays -->
        <section class="bottom-clouds">
          <div class="cloud-1--low-wrap">
            <div class="scene-layer cloud-1--low">
              <div class="cloud-overlays__season"></div>
              <div class="cloud-overlays__time"></div>
              <div class="cloud-overlays__temp"></div>
              <div class="cloud-overlays__weather"></div>
            </div>
          </div>
          <div class="scene-layer cloud-2--low">
            <div class="cloud-overlays__season"></div>
            <div class="cloud-overlays__time"></div>
            <div class="cloud-overlays__temp"></div>
            <div class="cloud-overlays__weather"></div>
          </div>
          <div class="scene-layer cloud-3--low">
            <div class="cloud-overlays__season"></div>
            <div class="cloud-overlays__time"></div>
            <div class="cloud-overlays__temp"></div>
            <div class="cloud-overlays__weather"></div>
          </div>
          <div class="scene-layer cloud-4--low">
            <div class="cloud-overlays__season"></div>
            <div class="cloud-overlays__time"></div>
            <div class="cloud-overlays__temp"></div>
            <div class="cloud-overlays__weather"></div>
          </div>
        </section>

      </div>

      <!--
        TERRAIN — trees, bushes, ridges, buildings.
        Each group has its own overlay container above it.
      -->
      <div class="scene-layer terrain">

        <!-- Trees + overlays -->
        <section class="scene-layer mask-layer trees">
          <div class="trees-1">
            <div class="trees-1--trunk"></div>
            <div class="trees-1--foliage">
              <div class="foliage-overlays__season"></div>
              <div class="foliage-overlays__time"></div>
              <div class="foliage-overlays__temp"></div>
              <div class="foliage-overlays__weather"></div>
            </div>
          </div>
          <div class="trees-2">
            <div class="trees-2--trunk"></div>
            <div class="trees-2--foliage">
              <div class="foliage-overlays__season"></div>
              <div class="foliage-overlays__time"></div>
              <div class="foliage-overlays__temp"></div>
              <div class="foliage-overlays__weather"></div>
            </div>
          </div>
          <div class="trees-3">
            <div class="trees-3--trunk"></div>
            <div class="trees-3--foliage">
              <div class="foliage-overlays__season"></div>
              <div class="foliage-overlays__time"></div>
              <div class="foliage-overlays__temp"></div>
              <div class="foliage-overlays__weather"></div>
            </div>
          </div>
          <div class="trees-4">
            <div class="trees-4--trunk"></div>
            <div class="trees-4--foliage">
              <div class="foliage-overlays__season"></div>
              <div class="foliage-overlays__time"></div>
              <div class="foliage-overlays__temp"></div>
              <div class="foliage-overlays__weather"></div>
            </div>
          </div>
          <div class="trees-5">
            <div class="trees-5--trunk"></div>
            <div class="trees-5--foliage">
              <div class="foliage-overlays__season"></div>
              <div class="foliage-overlays__time"></div>
              <div class="foliage-overlays__temp"></div>
              <div class="foliage-overlays__weather"></div>
            </div>
          </div>
        </section>

        <!-- Terrain ridges (1–3, behind buildings) + overlays -->
        <div class="scene-layer terrain-layer--accent terrain-1">
          <div class="terrain-overlays__season"></div>
          <div class="terrain-overlays__time"></div>
          <div class="terrain-overlays__temp"></div>
          <div class="terrain-overlays__weather"></div>
        </div>
        <div class="scene-layer terrain-layer terrain-2">
          <div class="terrain-overlays__season"></div>
          <div class="terrain-overlays__time"></div>
          <div class="terrain-overlays__temp"></div>
          <div class="terrain-overlays__weather"></div>
        </div>
        <div class="scene-layer terrain-layer terrain-3">
          <div class="terrain-overlays__season"></div>
          <div class="terrain-overlays__time"></div>
          <div class="terrain-overlays__temp"></div>
          <div class="terrain-overlays__weather"></div>
        </div>

        <!-- Bushes + overlays -->
        <div class="scene-layer bushes">
          <div class="bushes-1">
            <div class="bush-overlays__season"></div>
            <div class="bush-overlays__time"></div>
            <div class="bush-overlays__temp"></div>
            <div class="bush-overlays__weather"></div>
          </div>
          <div class="bushes-2">
            <div class="bush-overlays__season"></div>
            <div class="bush-overlays__time"></div>
            <div class="bush-overlays__temp"></div>
            <div class="bush-overlays__weather"></div>
          </div>
          <div class="bushes-3">
            <div class="bush-overlays__season"></div>
            <div class="bush-overlays__time"></div>
            <div class="bush-overlays__temp"></div>
            <div class="bush-overlays__weather"></div>
          </div>
        </div>

        <!-- Buildings + overlays -->
        <section class="scene-layer city">
          <div class="houseBlock--church"></div>
          <div class="houseBlock--main">
            <div class="houseBlock--main--windows"></div>
            <div class="houseBlock--main--roofs"></div>
          </div>
          <div class="houseBlock--left">
            <div class="houseBlock--left--roofs"></div>
            <div class="houseBlock--left--windows"></div>
          </div>
          <div class="houseBlock--small">
            <div class="houseBlock--small--windows"></div>
          </div>
          <aside class="building-overlays" aria-hidden="true">
            <div class="building-overlays__season"></div>
            <div class="building-overlays__time"></div>
            <div class="building-overlays__temp"></div>
            <div class="building-overlays__weather"></div>
          </aside>
        </section>

        <!-- Terrain ridges (4–5, in front of buildings) + overlays -->
        <div class="scene-layer terrain-layer terrain-4">
          <div class="terrain-overlays__season"></div>
          <div class="terrain-overlays__time"></div>
          <div class="terrain-overlays__temp"></div>
          <div class="terrain-overlays__weather"></div>
        </div>
        <div class="scene-layer terrain-layer terrain-5">
          <div class="terrain-overlays__season"></div>
          <div class="terrain-overlays__time"></div>
          <div class="terrain-overlays__temp"></div>
          <div class="terrain-overlays__weather"></div>
        </div>

      </div>

      <!-- Full-scene ambient grade (multiply + soft-light) -->
      <div class="scene-grade scene-grade--multiply" aria-hidden="true"></div>
      <div class="scene-grade scene-grade--softlight" aria-hidden="true"></div>
    </div>

    <div class="main-content">
      <div v-if="store.loading">Loading...</div>

      <div v-else-if="store.error">Error: {{ store.error }}</div>

      <div v-else-if="store.weather">
        <h1 class="text-6xl font-bold">{{ store.weather.temperature }}°</h1>
        <p class="mt-2 text-lg">Weather code: {{ store.weather.weathercode }}</p>
      </div>

      <div v-if="ui">
        <p class="mt-4 text-sm">{{ ui.key }}</p>
      </div>

      <div v-if="store.city">
        <p class="mt-4 text-sm">{{ store.city }} - {{ store.country }}</p>
      </div>
    </div>


  </div>
</template>

<style scoped lang="scss">
@use 'sass:map';
@use 'sass:list';
@use '~/assets/scss/mixins' as mx;

// =============================================================================
// Overlay pane mixin
// =============================================================================
// Opacity is baked into the background-color via color-mix() rather than set
// on the element itself. Setting opacity < 1 on an element that also has
// mix-blend-mode creates an isolated stacking context — the blend then
// composites against a transparent parent instead of the content layers below,
// making it a no-op. Encoding strength in the color's alpha avoids this.
@mixin overlay-pane($prefix) {
  position: absolute;
  inset: 0;
  // z-index: 1 places this pane above the parent's ::after pseudo-element.
  // Without it, ::after (z-index: auto, last in DOM order) would paint on top.
  z-index: 1;
  pointer-events: none;
  background-color: color-mix(
    in srgb,
    var(--#{$prefix}-overlay-color) calc(var(--#{$prefix}-overlay-opacity) * 100%),
    transparent
  );
  mix-blend-mode: var(--#{$prefix}-overlay-blend);
  // opacity is intentionally absent — see note above
}

// Sky axis panes — top→bottom gradient; blend lives on .sky-overlays container.
@mixin sky-overlay-pane($axis) {
  position: absolute;
  inset: 0;
  z-index: var(--sky-#{$axis}-overlay-z-index, auto);
  pointer-events: none;
  mix-blend-mode: normal;
  background-image: linear-gradient(
    to bottom,
    color-mix(
      in srgb,
      var(--sky-#{$axis}-overlay-stop-0) calc(var(--sky-#{$axis}-overlay-opacity) * 100%),
      transparent
    ),
    color-mix(
      in srgb,
      var(--sky-#{$axis}-overlay-stop-1) calc(var(--sky-#{$axis}-overlay-opacity) * 100%),
      transparent
    ),
    color-mix(
      in srgb,
      var(--sky-#{$axis}-overlay-stop-2) calc(var(--sky-#{$axis}-overlay-opacity) * 100%),
      transparent
    )
  );
}

// =============================================================================
// Overlay container mixin
// =============================================================================
// isolation: isolate is intentionally absent. It would create a new stacking
// context that traps blend modes inside the container, preventing them from
// compositing against the content layers below.
@mixin overlay-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// Returns a CSS four-value mask-position string for a cloud config map.
@function cloud-mask-pos($config) {
  @if not map.has-key($config, position) {
    @return top center;
  }
  $pos:   map.get($config, position);
  $keys:  map.keys($pos);
  $x-key: list.nth($keys, 1);
  $x-val: map.get($pos, $x-key);
  $y-key: list.nth($keys, 2);
  $y-val: map.get($pos, $y-key);
  @return unquote('#{$x-key} #{$x-val} #{$y-key} #{$y-val}');
}



// Per-tree config — neutral-gray base until foliage overlays color them.
$trees: (
  1: (
    width: calc(112px / 2),
    height: calc(194px / 2),
    offset: (right: 0%, top: -19%),
    z-index: 13,
    trunk-colors: (var(--trunk-base), var(--trunk-base)),
    foliage-colors: var(--foliage-base),
    trunk-mask-size: 100% auto,
    trunk-mask-position: 40% bottom,
  ),
  2: (
    width: calc(52px / 2),
    height: calc(102px / 2),
    offset: (right: 13%, top: -6%),
    z-index: 16,
    trunk-colors: (var(--trunk-base), var(--trunk-base)),
    foliage-colors: var(--foliage-base),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 40% bottom,
  ),
  3: (
    width: calc(79px / 2),
    height: calc(100px / 2),
    offset: (right: 21%, top: -6%),
    z-index: 16,
    trunk-colors: (var(--trunk-base), var(--trunk-base)),
    foliage-colors: var(--foliage-base),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 40% bottom,
  ),
  4: (
    width: calc(51px / 2),
    height: calc(99px / 2),
    offset: (left: 8%, top: -4%),
    z-index: 16,
    trunk-colors: (var(--trunk-base), var(--trunk-base)),
    foliage-colors: var(--foliage-base),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 55% 150%,
  ),
  5: (
    width: calc(64px / 2),
    height: calc(122px / 2),
    offset: (left: 1.5%, top: -11%),
    z-index: 8,
    trunk-colors: (var(--trunk-base), var(--trunk-base)),
    foliage-colors: var(--foliage-base),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 50% 180%,
  ),
);

@each $key, $config in $trees {
  .trees-#{$key} {
    @include mx.tree($key, $config);
  }
}

// Per-tree trunk overrides — custom gradients that don't fit the two-stop mixin default.
.trees-1--trunk { background: linear-gradient(83deg, var(--trunk-1-a) 40%, var(--trunk-1-b) 70%); }
.trees-2--trunk { background: linear-gradient(90deg, var(--trunk-2-a) 42%, var(--trunk-2-b) 54%); }
.trees-3--trunk { background: linear-gradient(0deg,  var(--trunk-3-a)  0%, var(--trunk-3-b) 100%); }
.trees-4--trunk { background: linear-gradient(0deg,  var(--trunk-4-a)  0%, var(--trunk-4-b) 100%); }
.trees-5--trunk { background: linear-gradient(90deg, var(--trunk-5-a) 44%, var(--trunk-5-b)  57%); }

// Per-tree foliage — full gradient from terrain paint cluster (--foliage-N-bg).
.trees-1--foliage { background: var(--foliage-1-bg); }
.trees-2--foliage { background: var(--foliage-2-bg); }
.trees-3--foliage { background: var(--foliage-3-bg); }
.trees-4--foliage { background: var(--foliage-4-bg); }
.trees-5--foliage { background: var(--foliage-5-bg); }

// =============================================================================
// Page shell
// =============================================================================

.main-content { display: none; }

.page-bg {
  position: relative;
  display: flex;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 1rem;
  color: #fff;
  text-align: center;
  isolation: isolate;
}

.scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  contain: layout style;
  isolation: isolate;
}

.scene-layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.mask-layer {
  @include mx.gradient-mask-layer;
  opacity: var(--layer-opacity, 1);
}

// Terrain ridges: mask + gradient. Terrain-1 adds accent stack via --accent modifier.
.terrain-layer {
  @include mx.masked-gradient-layer;
  opacity: var(--layer-opacity, 1);
}

.terrain-layer--accent {
  @include mx.gradient-mask-layer;
  opacity: var(--layer-opacity, 1);
}


// =============================================================================
// Full-scene grade
// =============================================================================
.scene-grade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-color: rgb(var(--scene-grade-rgb) / 1);
}
.scene-grade--multiply {
  z-index: 100;
  mix-blend-mode: multiply;
  opacity: var(--scene-grade-multiply-opacity);
}
.scene-grade--softlight {
  z-index: 101;
  mix-blend-mode: soft-light;
  opacity: var(--scene-grade-softlight-opacity);
}


// =============================================================================
// SKY
// =============================================================================
.sky-base {
  height: 55%;
  background: var(--sky-gradient);
  z-index: 1;
  position: relative;
}

// Sun glow — radial halo anchored to moon/sun disc position.
.sky-sun-glow {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse var(--sun-glow-size-x) var(--sun-glow-size-y) at var(--moon-left) var(--moon-top),
    rgb(var(--sun-glow-rgb) / 1)   0%,
    rgb(var(--sun-glow-rgb) / 0)   var(--sun-glow-falloff)
  );
  mix-blend-mode: var(--sun-glow-blend);
  opacity: var(--sun-glow-opacity);
}

// Sky overlay container + panes.
// Container owns mix-blend-mode; panes stack gradients with normal compositing.
.sky-overlays {
  @include overlay-container;
  z-index: 5;
  mix-blend-mode: var(--sky-overlay-blend);

  &__season  { @include sky-overlay-pane('season'); }
  &__time    { @include sky-overlay-pane('time'); }
  &__temp    { @include sky-overlay-pane('temp'); }
  &__weather { @include sky-overlay-pane('weather'); }
}


// =============================================================================
// Moon / sun disc
// =============================================================================
.moon {
  background-image: url('~/assets/images//Moon--full.png');
  background-size: 100% auto;
  background-position: center center;
  background-repeat: no-repeat;
  width:  calc(260px / 2);
  height: calc(260px / 2);
  position: absolute;
  z-index: 2;

  top:       var(--moon-top);
  left:      var(--moon-left);
  transform: translateX(var(--moon-translate-x));
  filter:    var(--moon-filter);
  opacity:   var(--moon-opacity);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgb(var(--moon-glow-rgb) / 0.5) 0%,
      rgb(var(--moon-glow-rgb) / 0)   100%
    );
    mix-blend-mode: soft-light;
    opacity: 0.5;
    filter: blur(5px);
  }
}


// =============================================================================
// Clouds
// =============================================================================
$clouds: (
  1: (
    dimensions: (width: inherit, height: inherit),
    bkg: var(--cloud-base-shadow),
    mask-type: svg,
    opacity: 1,
    z-index: 4,
    has-gradient-mask: true,
  ),
  2: (
    dimensions: (width: calc(260px / 2), height: calc(108px / 2)),
    position: (left: 0, top: 40%),
    bkg: var(--cloud-base-mid),
    mask-type: svg,
    opacity: 0.8,
    z-index: 3,
    filter: blur(8px),
  ),
  3: (
    dimensions: (width: calc(317px / 2), height: calc(148px / 2)),
    position: (right: -7%, top: 41%),
    bkg: var(--cloud-base-mid),
    mask-type: svg,
    z-index: 3,
  ),
  4: (
    dimensions: (width: calc(673px / 2), height: calc(208px / 2)),
    position: (right: -15%, top: 46%),
    bkg: var(--cloud-base-shadow),
    mask-type: svg,
    opacity: 0.75,
    z-index: 1,
    filter: blur(8px),
  ),
);
$clouds--low: (
  1: (
    dimensions: (width: calc(521px / 2), height: calc(332px / 2)),
    position: (right: -8%, bottom: 8%),
    bkg: var(--cloud-base-light),
    mask-type: png,
    opacity: 1,
    z-index: auto,
  ),
  2: (
    dimensions: (width: calc(694px / 2), height: calc(265px / 2)),
    position: (right: -8%, bottom: -6%),
    bkg: var(--cloud-base-light),
    mask-type: svg,
    opacity: 1,
    z-index: 3,
  ),
  3: (
    dimensions: (width: calc(546px / 2), height: calc(229px / 2)),
    position: (left: -5%, bottom: 0),
    bkg: var(--cloud-base-light),
    mask-type: svg,
    opacity: 0.25,
    z-index: 3,
    mix-blend-mode: screen,
  ),
  4: (
    dimensions: (width: calc(608px / 2), height: calc(334px / 2)),
    position: (left: -15%, bottom: -5%),
    bkg: var(--cloud-base-light),
    mask-type: svg,
    opacity: 1,
    z-index: 1,
  ),
);

@each $key, $config in $clouds {
  .cloud-#{$key} { @include mx.cloud($key, $config); }
}
@each $key, $config in $clouds--low {
  .cloud-#{$key}--low { @include mx.cloud($key, $config, '--low'); }
}

// Per-cloud background overrides.
.cloud-1 { background: linear-gradient(to bottom, var(--cloud-1-a), var(--cloud-1-b)); }
.cloud-2 { background: var(--cloud-2); }
.cloud-3 { background: radial-gradient(var(--cloud-3-a), var(--cloud-3-b)); }
.cloud-4 { background: var(--cloud-4); }

// Per-low-cloud background + opacity overrides (token-driven; see sky paint cluster).
.cloud-1--low { background: var(--cloud-1-low-bkg); opacity: var(--cloud-1-low-opacity); }
.cloud-2--low { background: var(--cloud-2-low-bkg); opacity: var(--cloud-2-low-opacity); }
.cloud-3--low { background: var(--cloud-3-low-bkg); opacity: var(--cloud-3-low-opacity); }
.cloud-4--low { background: var(--cloud-4-low-bkg); opacity: var(--cloud-4-low-opacity); }

.top-clouds,
.bottom-clouds {
  position: relative;
  display: block;
  width: 100%;
  height: 50%;
  z-index: 2;
}
.top-clouds    { z-index: 3; }
.bottom-clouds { opacity: 0.7; }

.cloud-1-wrap {
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  opacity: 0.85;
  width: 100%;
  height: calc(288px / 2);
  position: absolute;
  z-index: 4;
}
.cloud-1--low-wrap {
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
  width: calc(521px / 2);
  height: calc(332px / 2);
  position: absolute;
  right: -2%;
  bottom: 6%;
  z-index: 2;
}

// Cloud overlay containers — top + bottom each get four panes.
// Panes are masked to the cloud silhouettes by the parent `section`
// when needed; otherwise they sit full-bleed over the cloud group.
// Cloud overlay panes live inside each cloud element as children.
// The cloud element's own mask clips them automatically.

// Pane styles shared by all cloud elements.
.cloud-overlays__season  { @include overlay-pane('cloud-season'); }
.cloud-overlays__time    { @include overlay-pane('cloud-time'); }
.cloud-overlays__temp    { @include overlay-pane('cloud-temp'); }
.cloud-overlays__weather { @include overlay-pane('cloud-weather'); }


// =============================================================================
// Terrain
// =============================================================================
.terrain {
  height: 55%;
  z-index: auto;
  position: relative;
  top: -8%;
  background-color: transparent;
}

.terrain-1,
.terrain-2,
.terrain-3,
.terrain-4,
.terrain-5 {
  position: absolute;
  --mask-size: 100% auto;
  --mask-repeat: no-repeat;
}

.terrain-1,
.terrain-2,
.terrain-3,
.terrain-4,
.terrain-5 {
  --mask-position: top center;
}

.terrain-5 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-5--bkg.svg');
  --layer-bkg: linear-gradient(
    to right,
    var(--terrain-5-a)   0%,
    var(--terrain-5-b) 100%
  );
  --layer-opacity: 1;
  z-index: 5;
}
.terrain-4 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-4--bkg.svg');
  --layer-bkg: radial-gradient(
    circle at 72% 0%,
    var(--terrain-4-a)  0%,
    var(--terrain-4-b) 25%
  );
  --layer-opacity: 1;
  z-index: 6;
}
.terrain-3 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-3--bkg.svg');
  --layer-bkg: radial-gradient(
    circle at 28% 0,
    var(--terrain-3-a) -1%,
    var(--terrain-3-b) 15%
  );
  --layer-opacity: 1;
  top: 4%;
  z-index: 8;
}
.terrain-2 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-2--bkg.svg');
  --layer-bkg: radial-gradient(
    circle at 55% 0%,
    var(--terrain-2-a)  5%,
    var(--terrain-2-b) var(--terrain-2-b-stop, 11%)
  );
  --layer-opacity: 1;
  top: 4%;
  z-index: 9;
}
.terrain-1 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-1--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrains/Terrain-1--gradient.png');
  --layer-bkg: linear-gradient(to right, var(--terrain-1-c), var(--terrain-1-d) 90%);
  --accent-color: var(--terrain-1-a);
  --blend-mode: var(--terrain-1-blend, overlay);
  --layer-opacity: 1;
  top: 8%;
  z-index: 10;
}

// Terrain overlay panes live inside each .terrain-N element as children.
// The parent's mask-image automatically clips descendants — no position math needed.
.terrain-overlays__season  { @include overlay-pane('terrain-season'); }
.terrain-overlays__time    { @include overlay-pane('terrain-time'); }
.terrain-overlays__temp    { @include overlay-pane('terrain-temp'); }
.terrain-overlays__weather { @include overlay-pane('terrain-weather'); }

// =============================================================================
// Trees / foliage
// =============================================================================

.trees, .bushes {
  z-index: auto;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

// Foliage overlay panes live inside each .trees-N--foliage element as children.
// The foliage element's own mask clips them automatically.
.foliage-overlays__season  { @include overlay-pane('foliage-season'); }
.foliage-overlays__time    { @include overlay-pane('foliage-time'); }
.foliage-overlays__temp    { @include overlay-pane('foliage-temp'); }
.foliage-overlays__weather { @include overlay-pane('foliage-weather'); }


// =============================================================================
// Bushes
// =============================================================================
.bushes-1 {
  z-index: 14;
  width: calc(141px / 2);
  height: calc(62px / 2);
  background: var(--bush-base);
  position: absolute;
  right: 0%;
  top: 6%;
  mask-image: url('~/assets/images/masks/Trees&bushes/Bush-1--bkg.svg');

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('~/assets/images/masks/Trees&bushes/Bush-1--gradient.png') center center / 100% auto no-repeat;
    mix-blend-mode: soft-light;
    opacity: 0.5;
  }
}
.bushes-2 {
  z-index: 13;
  width: calc(160px / 2);
  height: calc(58px / 2);
  position: absolute;
  background: var(--bush-base);
  left: 0%;
  top: 10%;
  mask-image: url('~/assets/images/masks/Trees&bushes/Bush-2--bkg.svg');

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('~/assets/images/masks/Trees&bushes/Bush-2--gradient.png') center center / 100% auto no-repeat;
    mix-blend-mode: soft-light;
    opacity: 0.65;
  }
}
.bushes-3 {
  z-index: 9;
  width: calc(119px / 2);
  height: calc(49px / 2);
  background: var(--bush-base);
  position: absolute;
  left: 60%;
  top: 10%;
  mask-image: url('~/assets/images/masks/Trees&bushes/Bush-3--bkg.svg');
}

// Bush overlay panes live inside each .bushes-N element as children.
// The bush element's own mask clips them automatically.
.bush-overlays__season  { @include overlay-pane('bush-season'); }
.bush-overlays__time    { @include overlay-pane('bush-time'); }
.bush-overlays__temp    { @include overlay-pane('bush-temp'); }
.bush-overlays__weather { @include overlay-pane('bush-weather'); }

// Per-bush background — full gradient from terrain paint cluster (--bush-N-bg).
.bushes-1 { background: var(--bush-1-bg); }
.bushes-2 { background: var(--bush-2-bg); }
.bushes-3 { background: var(--bush-3-bg); }


// =============================================================================
// Buildings
// =============================================================================
.city { z-index: 6; }

.houseBlock--church {
  @include mx.house-block(church, (
    width: calc(68px / 2),
    height: calc(44px / 2),
    offset: (top: -2%, left: 17%),
    background: var(--building-church),
    z-index: 2,
  ));

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('~/assets/images/masks/Buildings/HouseBlock--church.svg') center center / 100% auto no-repeat;
    mix-blend-mode: overlay;
    opacity: 0.6;
  }
  &::after {
    content: '';
    @include mx.house-block-layer(church, windows, png, (
      background: var(--building-window-base),
      opacity: 0.9,
    ));
  }
}
.houseBlock--left {
  @include mx.house-block(left, (
    width: calc(223px / 2),
    height: calc(117px / 2),
    offset: (left: -1%, top: -9%),
    background: var(--building-wall-base),
  ));

  &--roofs {
    @include mx.house-block-layer(left, roofs, svg, (
      background: var(--building-roof-base),
      mask-position: center top,
    ));
  }
  &--windows {
    @include mx.house-block-layer(left, windows, png, (
      background: var(--building-window-base),
      opacity: 0.9,
    ));
  }
}
.houseBlock--small {
  @include mx.house-block(small, (
    width: calc(72px / 2),
    height: calc(67px / 2),
    offset: (right: 29%, top: -6%),
    background: var(--building-wall-base),
  ));

  &--windows {
    @include mx.house-block-layer(small, windows, svg, (
      background: var(--building-window-base),
      opacity: 0.9,
    ));
  }
}
.houseBlock--main {
  @include mx.house-block(main, (
    width: calc(129px / 2),
    height: calc(83px / 2),
    offset: (left: 30%, top: -6%),
    background: var(--building-wall-base),
  ));

  &--windows {
    @include mx.house-block-layer(main, windows, png, (
      background: var(--building-window-base),
      opacity: 0.9,
    ));
  }
  &--roofs {
    @include mx.house-block-layer(main, roofs, png, (
      background: var(--building-roof-base),
      mask-position: center -2px,
    ));
  }
}

// Building overlay container.
.building-overlays {
  @include overlay-container;
  z-index: 20;

  &__season  { @include overlay-pane('building-season'); }
  &__time    { @include overlay-pane('building-time'); }
  &__temp    { @include overlay-pane('building-temp'); }
  &__weather { @include overlay-pane('building-weather'); }
}


// =============================================================================
// UI card
// =============================================================================
.main-content {
  position: relative;
  z-index: 20;
  border-radius: 1rem;
  padding: 0.9rem 1.2rem;
  background: rgba(128, 128, 128, 0.22);
}
</style>