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
      :data-season="sceneDisplaySeason"
      :data-time="sceneDisplayTime"
      :data-weather="sceneDisplayWeather"
      :data-temp="sceneDisplayTemp"
    >
      <div class="scene-layer sky-base">
        <aside class="scene-layer sky-base-overlay">
          <div class="sky-base-overlay--night-wash"></div>
          <div class="sky-base-overlay--sun-glow"></div>
          <div class="sky-base-overlay--topClouds-overlay">
            <div class="sky-base-overlay--topClouds-overlay__paint"></div>
          </div>
          <div class="sky-base-overlay--cloudy-overlay"></div>
          <div class="sky-base-overlay--morning-overlay"></div>
          <div class="sky-base-overlay--afternoon-overlay"></div>
          <div class="sky-base-overlay--evening-overlay"></div>
        </aside>
        <div class="scene-layer moon"></div>
        <section class="top-clouds">
          <div class="cloud-1-wrap">
            <div class="scene-layer cloud-1"></div>
          </div>
          <div class="scene-layer cloud-2"></div>
          <div class="scene-layer cloud-3"></div>
          <div class="scene-layer cloud-4"></div>
        </section>
        <section class="bottom-clouds">
          <div class="cloud-1--low-wrap">
            <div class="scene-layer cloud-1--low"></div>
          </div>
         <!--  <div class="scene-layer cloud-1--low"></div> -->
          <div class="scene-layer cloud-2--low"></div>
          <div class="scene-layer cloud-3--low"></div>
          <div class="scene-layer cloud-4--low"></div>
        </section>
      </div>


      <div class="scene-layer mask-layer terrain">
        <section class="scene-layer mask-layer trees">
          <div class="trees-1">
            <div class="trees-1--trunk"></div>
            <div class="trees-1--foliage"></div>
          </div>
          <div class="trees-2">
            <div class="trees-2--trunk"></div>
            <div class="trees-2--foliage"></div>
          </div>
          <div class="trees-3">
            <div class="trees-3--trunk"></div>
            <div class="trees-3--foliage"></div>
          </div>
          <div class="trees-4">
            <div class="trees-4--trunk"></div>
            <div class="trees-4--foliage"></div>
          </div>
          <div class="trees-5">
            <div class="trees-5--trunk"></div>
            <div class="trees-5--foliage"></div>
          </div>
        </section>

        <aside class="scene-layer terrain-overlay">
          <div class="terrain-overlay--morning"></div>
        </aside>

        <div class="scene-layer bushes">
          <div class="bushes-1"></div>
          <div class="bushes-2"></div>
          <div class="bushes-3"></div>
        </div>

        <div class="scene-layer mask-layer terrain-1"></div>
        <div class="scene-layer mask-layer terrain-2"></div>
        <div class="scene-layer mask-layer terrain-3"></div>

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
        </section>

        <div class="scene-layer mask-layer terrain-4"></div>
        <div class="scene-layer mask-layer terrain-5"></div>
      </div>

      <!--
        Ambient grade: multiply + soft-light stack over the whole illustration.
        Strengths tied to `[data-time]` via `--scene-grade-*` in _theme.scss
        (no raw hex here).
      -->
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

// Returns a CSS four-value mask-position string for a cloud config map.
// Four-value syntax (`left 0 top 40%`) means "top edge of image at 40% from
// top of container" — exactly the same as `top: 40%` on the element, with no
// percentage-scaling maths needed. Cloud 1 has no `position` key → top center.
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
  // Interpolate into a single string so Sass treats it as one list item
  // and doesn't split it across the comma-separated mask-position list.
  @return unquote('#{$x-key} #{$x-val} #{$y-key} #{$y-val}');
}



// Color tokens come from `_theme.scss` (loaded globally via base.scss) as
// CSS custom properties on `:root`. This file references them via `var(--…)`
// and never declares raw hex values.
// Per-tree config. Add a new entry here to render a new tree;
$trees: (
  1: (
    width: calc(112px / 2),
    height: calc(194px / 2),
    offset: (right: 0%, top: -19%),
    z-index: 13,
    trunk-colors: (var(--trunk-base-accent), var(--trunk-tip)),
    foliage-colors: linear-gradient(125deg, var(--foliage-warm-accent) 10%, var(--foliage-cool) 95%),
    trunk-mask-size: 100% auto,
    trunk-mask-position: 40% bottom,
  ),
  2: (
    width: calc(52px / 2),
    height: calc(102px / 2),
    offset: (right: 13%, top: -6%),
    z-index: 16,
    trunk-colors: (var(--trunk-base), var(--trunk-tip)),
    foliage-colors: linear-gradient(125deg, var(--foliage-warm) 10%, var(--foliage-cool) 95%),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 40% bottom,
  ),
  3: (
    width: calc(79px / 2),
    height: calc(100px / 2),
    offset: (right: 21%, top: -6%),
    z-index: 16,
    trunk-colors: (var(--trunk-base), var(--trunk-tip)),
    foliage-colors: linear-gradient(
      125deg, 
      var(--foliage-warm) 8%, 
      var(--foliage-warm-deep) 52%, 
      var(--foliage-cool) 96%
    ),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 40% bottom,
  ),
  4: (
    width: calc(51px / 2),
    height: calc(99px / 2),
    offset: (left: 8%, top: -4%),
    z-index: 16,
    trunk-colors: (var(--trunk-base), var(--trunk-tip)),
    foliage-colors: linear-gradient(125deg, var(--foliage-warm) 10%, var(--foliage-cool) 95%),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 55% 150%,
  ),
  5: (
    width: calc(64px / 2),
    height: calc(122px / 2),
    offset: (left: 1.5%, top: -11%),
    z-index: 8,
    trunk-colors: (var(--trunk-base), var(--trunk-tip)),
    foliage-colors: linear-gradient(-90deg, var(--foliage-warm-deep) 10%, var(--foliage-cool) 95%),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 50% 180%,
  ),
);

@each $key, $config in $trees {
  .trees-#{$key} {
    @include mx.tree($key, $config);
  }
}

.main-content { display: none }

// Full-scene tonal grade — tokens from `_theme.scss` (`--scene-grade-*`).
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
/*   background: 
    radial-gradient(circle at 22% 20%, rgba(246, 202, 137, 0.18) 0%, rgba(95, 82, 111, 0) 40%),
    linear-gradient(to bottom, #66617e 0%, #5b5a73 34%, #3f3b54 58%, #2b2238 100%); */
}

.scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  // Limit style/layout invalidation to the illustration when `data-time` etc. change.
  contain: layout style;
  isolation: isolate;
}

.scene-layer {
  position: absolute;
  //inset: 0;
  width: 100%;
  height: 100%;
}

.mask-layer {
  @include mx.gradient-mask-layer;
  opacity: var(--layer-opacity, 1);
}

.sky-base-overlay {
  // Container for atmospheric overlays sitting between the sky gradient
  // and the cloud layers. Each child is a full-bleed pane whose look is
  // driven by tokens in _theme.scss so time-of-day / weather variants
  // can tune them without touching markup.

  .sky-base-overlay--sun-glow {
    // Warm halo radiating from the sun into the upper sky. The ellipse
    // is taller than the box (130% vertical radius) so the falloff
    // happens off-canvas — what you see is a soft column of light biased
    // upward. Anchored to the `--moon-*` position tokens so the halo
    // tracks the disc wherever it sits. Off by default (opacity 0); the
    // evening / sunset variants in _theme.scss dial it in. Z-index 0
    // keeps it beneath every top cloud (which start at z 1).
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse var(--sun-glow-size-x) var(--sun-glow-size-y) at var(--moon-left) var(--moon-top),
      rgb(var(--sun-glow-rgb) / 1)   0%,
      rgb(var(--sun-glow-rgb) / 0) var(--sun-glow-falloff)
    );
    mix-blend-mode: var(--sun-glow-blend);
    opacity: var(--sun-glow-opacity);
  }

  .sky-base-overlay--cloudy-overlay {
    background: var(--cloudy-overlay-color);
    z-index: 10;
    position: absolute;
    inset: 0;
    opacity: var(--cloudy-overlay-opacity);
  }
  

  .sky-base-overlay--night-wash {
    // Deep navy pane that "pushes" the sky toward a colder, denser
    // nighttime mood via a `hard-light` blend. Painted as a vertical
    // gradient — heavy at the zenith, lighter toward the horizon — so
    // the sky keeps its top-down depth instead of going flat. Anchored
    // to z 1 so it sits above the sun-glow but below clouds, moon, and
    // the cloudy overlay. Off by default; `[data-time='night']` engages it.
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      rgb(var(--night-wash-rgb) / 1)    0%,
      rgb(var(--night-wash-rgb) / 0.5) 100%
    );
    mix-blend-mode: var(--night-wash-blend);
    opacity: var(--night-wash-opacity);
  }
}
.sky-base {
  height: 55%;
  background: var(--sky-gradient);
  z-index: 1;
  position: relative;
}

// Afternoon + cold: blend procedural sky with `References/Autumn | Cloudy | Afternoon | Cold.png`.
.scene[data-time='afternoon'][data-temp='cold'] .sky-base {
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    mix-blend-mode: var(--sky-ref-afternoon-cold-blend, soft-light);
    opacity: var(--sky-ref-afternoon-cold-opacity, 0.42);
  }

  > .sky-base-overlay {
    z-index: 1;
  }
}
.terrain {
  height: 55%;
  z-index: auto;
  opacity: 1;
  position: relative;
  top:-8%;
  background-color: transparent;

 /*  .scene-layer,
  .mask-layer,
  * {
    z-index: auto;
  } */
}

.terrain-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

// Full-bleed terrain grade — off unless `.scene` sets `--terrain-overlay-opacity`.
// All five `Terrain-*--bkg` masks unioned (back → front: 5…1). Positions mirror
// each `.terrain-N` slab (`top` / `mask-position`); tune in DevTools as needed.
.terrain-overlay--morning {
  position: absolute;
  inset: 0;
  z-index: 15;
  background: linear-gradient(
    to bottom,
    var(--terrain-warm-top),
    var(--terrain-warm-bottom)
  );
  mix-blend-mode: var(--terrain-overlay-blend-mode);
  opacity: var(--terrain-overlay-opacity);

  -webkit-mask-image:
   url('~/assets/images/masks/Terrains/Terrain-4--bkg.svg'),
    url('~/assets/images/masks/Terrains/Terrain-3--bkg.svg');
  mask-image:
    url('~/assets/images/masks/Terrains/Terrain-4--bkg.svg'),
    url('~/assets/images/masks/Terrains/Terrain-3--bkg.svg');

  -webkit-mask-size: 
    100% auto, 
    100% auto;
  mask-size: 
    100% auto, 
    100% auto;

  // terrain-5: bottom center · 4: top center · 3/2: top 4% · 1: top 8%
  -webkit-mask-position: center top, center -5.5%;
  mask-position: center top, center -5.5%;

  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  -webkit-mask-composite: source-over;
  mask-composite: add;
}

[class*='terrain-'] {
  position: absolute;
  --mask-size: 100% auto;
  --mask-position: top center;
  --mask-repeat: no-repeat;
}

/* ––– Buildings ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
.city { z-index: 6 }
.houseBlock--church {
  @include mx.house-block(church, (
    width: calc(68px / 2),
    height: calc(44px / 2),
    offset: (top: -2%, left: 17%),
    background: linear-gradient(45deg, var(--house-roof) 10%, var(--house-church-accent) 100%),
    z-index: 2,
  ));

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('~/assets/images/masks/Buildings/HouseBlock--church.svg') center center / 100% auto no-repeat;
    mix-blend-mode: soft-light;
    opacity: 0.7;
  }
  &::after {
    content: '';
    @include mx.house-block-layer(church, windows, png, (
      background: var(--window-lit),
      opacity: 0.9,
    ));
  }
}
.houseBlock--left {
  @include mx.house-block(left, (
    width: calc(223px / 2),
    height: calc(117px / 2),
    offset: (left: -1%, top: -9%),
  ));

  &--roofs {
    @include mx.house-block-layer(left, roofs, svg, (
      background: var(--house-roof-light),
      mask-position: center top,
    ));
  }
  &--windows {
    @include mx.house-block-layer(left, windows, png, (
      background: var(--window-lit),
      opacity: 0.9,
    ));
  }
}
.houseBlock--small {
  @include mx.house-block(small, (
    width: calc(72px / 2),
    height: calc(67px / 2),
    offset: (right: 29%, top: -6%),
  ));

  &--windows {
    @include mx.house-block-layer(small, windows, svg, (
      background: var(--window-lit),
      opacity: 0.9,
    ));
  }
}
.houseBlock--main {
  @include mx.house-block(main, (
    width: calc(129px / 2),
    height: calc(83px / 2),
    offset: (left: 30%, top: -6%),
  ));

  &--windows {
    @include mx.house-block-layer(main, windows, png, (
      background: var(--window-lit),
      opacity: 0.9,
    ));
  }
  &--roofs {
    @include mx.house-block-layer(main, roofs, png, (
      background: var(--house-roof-lighter),
      mask-position: center -2px,
    ));
  }
}
/* ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */


.moon {
  // Position + look come from `--moon-*` tokens declared on `:root` in
  // _theme.scss; time-of-day variants override them on `.scene` so the
  // values cascade in here. Declaring `--moon-*` on `.moon` itself would
  // shadow the inherited override, so we only *consume* the tokens here.
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
      rgb(var(--moon-glow-rgb) / 0)   100%);
    mix-blend-mode: soft-light;
    opacity: 0.5;
    filter: blur(5px);
  }
}

/* ––– Clouds –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
$clouds: (
  1: (
    dimensions: (width: inherit, height: inherit),
    bkg: linear-gradient(to bottom, var(--cloud-shadow) 0%, var(--cloud-mid-dark) 100%),
    mask-type: svg,
    opacity: 1,
    z-index: 4,
    has-gradient-mask: true,
  ),
  2: (
    dimensions: (width: calc(260px / 2), height: calc(108px / 2)),
    position: (left: 0, top: 40%),
    bkg: linear-gradient(to left, var(--cloud-warm) 0%, var(--cloud-mid) 100%),
    mask-type: svg,
    opacity: 0.8,
    z-index: 3,
    filter: blur(8px),
  ),
  3: (
    dimensions: (width: calc(317px / 2), height: calc(148px / 2)),
    position: (right: -7%, top: 41%),
    bkg: radial-gradient(circle at 45% 15%, var(--cloud-mid) 0%, var(--cloud-shadow-deep) 90%),
    mask-type: svg,
    z-index: 3,
  ),
  4: (
    dimensions: (width: calc(673px / 2), height: calc(208px / 2)),
    position: (right: -15%, top: 46%),
    bkg: var(--cloud-mid-dark),
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
    bkg: radial-gradient(circle at 40% 30%, var(--cloud-light) 10%, var(--cloud-shadow) 62%),
    mask-type: png,
    opacity: 1,
    z-index: auto,
  ),
  2: (
    dimensions: (width: calc(694px / 2), height: calc(265px / 2)),
    position: (right: -8%, bottom: -6%),
    bkg: radial-gradient(circle at 45% 15%, var(--cloud-light) 0%, var(--cloud-mid-dark) 60%),
    mask-type: svg,
    opacity: 1,
    z-index: 3,
  ),
  3: (
    dimensions: (width: calc(546px / 2), height: calc(229px / 2)),
    position: (left: -5%, bottom: 0),
    bkg: radial-gradient(circle at 45% 15%, var(--cloud-light) 0%, var(--cloud-mid-dark) 60%),
    mask-type: svg,
    opacity: 0.25,
    z-index: 3,
    mix-blend-mode: screen,
  ),
  4: (
    dimensions: (width: calc(608px / 2), height: calc(334px / 2)),
    position: (left: -15%, bottom: -5%),
    bkg: radial-gradient(circle at 46% 40%, var(--cloud-light) 0%, var(--cloud-mid-dark) 46%),
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

// Mask container — always present, holds the cloud-shape masks.
// Children provide the color/blend per scene condition.
.sky-base-overlay--topClouds-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;

  mask-image:
    url('~/assets/images/masks/Clouds/Cloud-1--mask.svg'),
    url('~/assets/images/masks/Clouds/Cloud-3--mask.svg'),
    url('~/assets/images/masks/Clouds/Cloud-4--mask.svg');

  mask-size:
    100% auto,
    map.get($clouds, 3, dimensions, width) map.get($clouds, 3, dimensions, height),
    map.get($clouds, 4, dimensions, width) map.get($clouds, 4, dimensions, height);

  mask-position: top center, right -12% top 26.5%, right -145% top 33.5%;
  mask-repeat: no-repeat;
  mask-composite: add;
  -webkit-mask-composite: source-over;
}

// Paint layer — hidden by default, shown per scene condition.
.sky-base-overlay--topClouds-overlay__paint {
  display: none;
  position: absolute;
  inset: 0;
}

// cold + night
.scene[data-time='night'][data-temp='cold'] .sky-base-overlay--topClouds-overlay__paint {
  display: block;
  background: linear-gradient(45deg, #010f63, transparent);
  mix-blend-mode: overlay;
  opacity: 0.5;
}

.top-clouds,
.bottom-clouds {
  position: relative;
  display: block;
  width: 100%;
  height: 50%;
  z-index: 2;
}
.top-clouds { z-index: 3 }
.bottom-clouds { opacity: 0.7 }

.cloud-1-wrap {
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  opacity: 0.65;
  width: 100%;
  height:  calc(288px / 2);
  position: absolute;
  z-index: 4;
}
.cloud-1--low-wrap {
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
  width: calc(521px / 2);
  height:  calc(332px / 2);
  position: absolute;
  right: -2%;
  bottom: 6%;
  z-index: 2;
}
/* ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */


.terrain-5 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-5--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrains/Terrain-5--gradient.png');
  --layer-bkg: var(--terrain-5-deep);
  --accent-color: var(--terrain-5-accent);
  --blend-mode: color;
  --layer-opacity: 1;

  background-color: var(--terrain-5-deep);
  -webkit-mask: var(--mask-image) var(--mask-position, bottom center) / var(--mask-size, 100% auto) no-repeat;
          mask: var(--mask-image) var(--mask-position, bottom center) / var(--mask-size, 100% auto) no-repeat;
  z-index: 5;
}
.terrain-4 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-4--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrains/Terrain-4--gradient.png');
  --layer-bkg: var(--terrain-4-deep);
  --accent-color: var(--terrain-4-accent);
  --blend-mode: color;
  --layer-opacity: 1;
  z-index: 6;
}
.terrain-3 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-3--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrains/Terrain-3--gradient.png');
  --layer-bkg: var(--terrain-3-deep);
  --accent-color: var(--terrain-3-accent);
  --blend-mode: overlay;
  --layer-opacity: 1;
  top: 4%;
  z-index: 8;
}
.terrain-2 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-2--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrains/Terrain-2--gradient.png');
  --layer-bkg: linear-gradient(
    -45deg,
    var(--terrain-2-deep) 20%,
    var(--terrain-2-mid) 100%
  );
  --accent-color: var(--terrain-2-accent);
  --blend-mode: color;
  --layer-opacity: 1;
  top: 4%;
  z-index: 9;
}
.terrain-1 {
  --mask-image: url('~/assets/images/masks/Terrains/Terrain-1--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrains/Terrain-1--gradient.png');
  --layer-bkg: linear-gradient(
    45deg,
    var(--terrain-1-deep) 0%,
    var(--terrain-1-mid) 100%
  );
  --accent-color: var(--terrain-1-accent);
  --blend-mode: overlay;
  --layer-opacity: 1;
  top: 8%;
  z-index: 10;
}

// Terrain layers — `data-temp='cold'` only (scene / API temp band).
.scene[data-temp='cold'] .terrain-1 {
  --layer-bkg: linear-gradient(
    45deg,
    color-mix(in srgb, var(--terrain-1-deep) 50%, transparent) 0%,
    color-mix(in srgb, var(--terrain-1-mid) 50%, transparent) 100%
  );
}

.scene[data-time='morning'][data-temp='cold'] .terrain-1 {
  --accent-color: rgb(172 157 96);
}

.scene[data-time='evening'][data-temp='cold'] .terrain-1 {
  --accent-color: rgb(113 72 20);
}

.scene[data-time='evening'][data-temp='cold'] .terrain-2 {
  --accent-color: rgb(113 72 20);
  --blend-mode: color;
}

.scene[data-temp='cold'] .terrain-2 {
  --accent-color: #c4af78;
  --blend-mode: overlay;
}

.scene[data-temp='cold'] .terrain-4 {
  --layer-bkg: transparent;
}

// Cloud-4 (top) — morning + cold only.
.scene[data-time='morning'][data-temp='cold'] .cloud-4 {
  background: #9fa9b4;
}

// cloudy / autumn / morning / warm — terrain accents reuse `--terrain-warm-*`.
.scene[data-scene-id='cloudy--autumn--morning--warm'] .terrain-1,
.scene[data-scene-id='cloudy--autumn--morning--warm'] .terrain-2,
.scene[data-scene-id='cloudy--autumn--morning--warm'] .terrain-4,
.scene[data-scene-id='cloudy--autumn--morning--warm'] .terrain-5 {
  --accent-color: var(--terrain-warm-top);
}

.scene[data-scene-id='cloudy--autumn--morning--warm'] .terrain-3 {
  --accent-color: var(--terrain-warm-bottom);
}

.scene[data-scene-id='cloudy--autumn--morning--warm'] .trees-1--foliage {
  background: linear-gradient(125deg, #9c482d 10%, #d7873f 95%);
}

.scene[data-scene-id='cloudy--autumn--morning--warm'] .trees-2--foliage,
.scene[data-scene-id='cloudy--autumn--morning--warm'] .trees-4--foliage {
  background: linear-gradient(125deg, #9e5f26 10%, #eba43e 95%);
}

.scene[data-scene-id='cloudy--autumn--morning--warm'] .trees-3--foliage {
  background: linear-gradient(125deg, #9e5f26 8%, #d7873f 52%, #eba43e 96%);
}

.scene[data-scene-id='cloudy--autumn--morning--warm'] .trees-5--foliage {
  background: linear-gradient(-90deg, #9c482d 10%, #d7873f 95%);
}

.trees, .bushes {
  z-index: auto;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
.bushes-1 {
  z-index: 14;
  width: calc(141px / 2);
  height: calc(62px / 2);
  background: linear-gradient(
    160deg,
    var(--bush-light) 25%,
    var(--bush-dark) 85%
  );
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
  background: linear-gradient(
    160deg,
    var(--bush-light) 0%,
    var(--bush-mid) 50%
  );
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
  z-index: 10;
  width: calc(119px / 2);
  height: calc(49px / 2);
  background: linear-gradient(
    160deg,
    var(--bush-light) 30%,
    var(--bush-mid) 60%
  );
  position: absolute;
  left: 60%;
  top: 10%;
  mask-image: url('~/assets/images/masks/Trees&bushes/Bush-3--bkg.svg');
}

.foreground-haze {
  background: linear-gradient(
    to top,
    rgb(var(--haze-rgb) / 0.75) 0%,
    rgb(var(--haze-rgb) / 0.22) 38%,
    rgb(var(--haze-rgb) / 0)    62%
  );
  mix-blend-mode: multiply;
  opacity: 0.95;
  z-index: 15;
}



.main-content {
  position: relative;
  z-index: 20;
  border-radius: 1rem;
  padding: 0.9rem 1.2rem;
  background: rgb(var(--haze-rgb) / 0.22);
}
</style>