<script setup>
import { computed, onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weather.store'
import { useLocation } from '@/composables/useLocation'
import { fetchWeather } from '@/composables/useWeather'
import { mapWeatherToUI } from '@/utils/weatherMapper'
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

const sceneStateClasses = computed(() => ['is-night', 'is-cloudy', 'windows-lit'])
</script>

<template>
  <div class="page-bg">
    <div class="scene" :class="sceneStateClasses">
      <div class="scene-layer sky-base"></div>
      <div class="scene-layer mask-layer terrain">
        <div class="scene-layer mask-layer bushes-in-front">
          <div class="bushes-1"></div>
          <div class="trees-1">
            <div class="trees-1--trunk"></div>
            <div class="trees-1--foliage"></div>
          </div>
          <div class="bushes-2"></div>
        </div>
        <div class="scene-layer mask-layer terrain-1"></div>
        <div class="scene-layer mask-layer terrain-2">
          <div class="bushes-3"></div>
        </div>
        <div class="scene-layer mask-layer terrain-3"></div>
        <div class="scene-layer mask-layer terrain-4"></div>
      </div>
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
@use '~/assets/scss/mixins' as mx;

$autumn-palette: (
  "bushes": (
    "1-lighter": #c17122,
    "1-light": #ae5e19,
    "1-med": #673611,
    "1-dark": #412415,
    "3-light": #432616,
    "3-dark": #81481a,
    "tree-1-trunk1": #5f1203,
    "tree-1-trunk2": #281416,
    "tree-1-foliage1": #d06c33,
    "tree-1-foliage2": #421f20,
  )
);

$terrain-1-colors: (
  "accent": #db801b,
  "darkBrown": #3b1924,
  "medBrown": #503229
);
$terrain-2-colors: (
  "accent": #be622d,
  "darkBrown": #421513,
  "medBrown": #8d4828
);
$terrain-3-colors: (
  "accent": #ba581f,
  "darkBrown": #743a24,
  "medBrown": #8d4828
);
$terrain-4-colors: (
  "accent": #ba581f,
  "darkBrown": #58211d,
  "medBrown": #8d4828
);


$stormyNight--light: #66617e;
$stormyNight--lighter: #5b5a73;
$stormyNight--med: #4e4e56;
$stormyNight--darker: #4b4856;
$stormyNight--darkest: #2b2238;
$sky--bkg: linear-gradient(to bottom, $stormyNight--darkest 0%, $stormyNight--med 50%, $stormyNight--lighter 66%, $stormyNight--light 100%);

.main-content { display: none }


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
}

.scene-layer {
  position: absolute;
  inset: 0;
}

.mask-layer {
  @include mx.gradient-mask-layer;
  opacity: var(--layer-opacity, 1);
}

.sky-base {
  height: 55%;
  background: $sky--bkg;
  z-index: 1;
  position: relative;
  outline: 1px solid rgb(42, 40, 168);
}
.terrain {
  height: 55%;
  outline: 1px solid rgb(41, 175, 119);
  z-index: 2;
  opacity: 1;
  position: relative;
  top:-8%;
  background-color: transparent;
}

[class*='terrain-'] {
  position: absolute;
  --mask-size: 100% auto;
  --mask-position: top center;
  --mask-repeat: no-repeat;
}

.moon {
  background: radial-gradient(circle at 22% 18%, rgba(255, 234, 193, 0.95) 0%, rgba(246, 178, 114, 0.55) 9%,
      rgba(255, 184, 109, 0.14) 18%, rgba(255, 185, 101, 0) 25%);
  mix-blend-mode: screen;
  opacity: 0.9;
  z-index: 2;
}

.clouds-far {
  --mask-image: url('~/assets/images/PartlyCloudy -9.svg');
  --mask-size: 102% auto;
  --mask-position: top center;
  --layer-bkg: linear-gradient(to bottom, rgba(112, 111, 132, 0.75) 0%, rgba(78, 77, 101, 0.45) 85%);
  --blend-mode: lighten;
  --layer-opacity: 0.5;
  z-index: 3;
}

.clouds-near {
  --mask-image: url('~/assets/images/PartlyCloudy -9 copy 2.svg');
  --mask-size: 100% auto;
  --mask-position: top center;
  --layer-bkg: linear-gradient(to bottom, rgba(148, 145, 162, 0.5) 0%, rgba(64, 62, 89, 0.65) 90%);
  --blend-mode: screen;
  --layer-opacity: 0.38;
  z-index: 4;
}

.terrain-4 {
  --mask-image: url('~/assets/images/masks/Terrain-4--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrain-4--gradient.png');
  --layer-bkg: #{map.get($terrain-4-colors, darkBrown)};
  --accent-color: #{map.get($terrain-4-colors, accent)};
  --blend-mode: color;
  --layer-opacity: 1;
  z-index: 7;
}
.terrain-3 {
  --mask-image: url('~/assets/images/masks/Terrain-3--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrain-3--gradient.png');
  --layer-bkg: #{map.get($terrain-3-colors, darkBrown)};
  --accent-color: #{map.get($terrain-3-colors, accent)};
  --blend-mode: overlay;
  --layer-opacity: 1;
  top: 4%;
  z-index: 8;
}
.terrain-2 {
  --mask-image: url('~/assets/images/masks/Terrain-2--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrain-2--gradient.png');
  --layer-bkg: linear-gradient(
    -45deg,
    #{map.get($terrain-2-colors, darkBrown)} 20%,
    #{map.get($terrain-2-colors, medBrown)} 100%
  );  
  --accent-color: #{map.get($terrain-2-colors, accent)};
  --blend-mode: color;
  --layer-opacity: 1;
  top: 4%;
  z-index: 9;
}
.terrain-1 {
  --mask-image: url('~/assets/images/masks/Terrain-1--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrain-1--gradient.png');
  --layer-bkg: linear-gradient(
    45deg,
    #{map.get($terrain-1-colors, darkBrown)} 0%,
    #{map.get($terrain-1-colors, medBrown)} 100%
  );
  --accent-color: #{map.get($terrain-1-colors, accent)};
  --blend-mode: overlay;
  --layer-opacity: 1;
  top: 8%;
  z-index: 10;
}

.bushes-in-front {
  z-index: 15;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  outline: 2px solid magenta
}
.bushes-1 { 
  z-index: 11;
  width: calc(141px / 2);
  height: calc(62px / 2);
  background: linear-gradient(
    160deg,
    #{map.get($autumn-palette, bushes, "1-lighter")} 25%,
    #{map.get($autumn-palette, bushes, "1-dark")} 85%
  );
  position: absolute;
  right: 0%;
  top: 6%;
  mask-image: url('~/assets/images/masks/Bush-1--bkg.svg');

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('~/assets/images/masks/Bush-1--gradient.png') center center / 100% auto no-repeat;
    mix-blend-mode: soft-light;
    opacity: 0.5;
  }
}
.bushes-2 {
  z-index: 12;
  width: calc(160px / 2);
  height: calc(58px / 2);
  position: absolute;
  background: linear-gradient(
    160deg,
    #{map.get($autumn-palette, bushes, "1-lighter")} 0%,
    #{map.get($autumn-palette, bushes, "1-med")} 50%
  );
  left: 0%;
  top: 10%;
  mask-image: url('~/assets/images/masks/Bush-2--bkg.svg');

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: url('~/assets/images/masks/Bush-2--gradient.png') center center / 100% auto no-repeat;
    mix-blend-mode: soft-light;
    opacity: 0.65;
  }
}
.bushes-3 {
  z-index: 13;
  width: calc(119px / 2);
  height: calc(49px / 2);
  background: linear-gradient(
    160deg,
    #{map.get($autumn-palette, bushes, "1-lighter")} 30%,
    #{map.get($autumn-palette, bushes, "1-med")} 60%
  );
  position: absolute;
  left: 60%;
  top: 6%;
  mask-image: url('~/assets/images/masks/Bush-3--bkg.svg');
}

.trees-1 {
  z-index: 11;
  width: calc(112px / 2);
  height: calc(194px / 2);
  position: absolute;
  right: 0%;
  top: -19%;
  z-index: 1;

  &--trunk {
    width: 100%;
    height: auto;
    background: linear-gradient(
      90deg,
      #{map.get($autumn-palette, bushes, "tree-1-trunk1")} 0%,
      #{map.get($autumn-palette, bushes, "tree-1-trunk2")} 100%
    );
    position: absolute;
    inset: 0;
    top: 0;
    mask-image: url('~/assets/images/masks/Tree-1--trunk.svg');
    mask-size: 100% auto;
    mask-position: 40% bottom;
    mask-repeat: no-repeat;
    z-index: 2;
  }
  &--foliage {
    width: 100%;
    aspect-ratio: 0.875 / 1;
    background: linear-gradient(
      125deg,
      #{map.get($autumn-palette, bushes, "tree-1-foliage1")} 10%,
      #{map.get($autumn-palette, bushes, "tree-1-foliage2")} 95%
    );
    position: absolute;
    inset: 0;
    top: 0;
    mask-image: url('~/assets/images/masks/Tree-1--foliage.png');
    mask-size: 100% auto;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: url('~/assets/images/masks/Tree-1--foliage.png') center center / 100% auto no-repeat;
      mix-blend-mode: luminosity;
      opacity: 1;
    }
  }
}


.houses {
  --mask-image: url('~/assets/images/Bkg-1.svg');
  --mask-size: 112% auto;
  --mask-position: bottom center;
  --layer-bkg: linear-gradient(to top, rgba(39, 30, 40, 0.95) 0%, rgba(66, 55, 75, 0.85) 22%, rgba(90, 69, 88, 0.15) 100%);
  --blend-mode: multiply;
  --layer-opacity: 0.48;
  z-index: 13;
}

.houses-windows {
  --mask-image: url('~/assets/images/Bkg-1.svg');
  --mask-size: 112% auto;
  --mask-position: bottom center;
  --layer-bkg: radial-gradient(circle at 26% 76%, rgba(255, 218, 157, 0.95) 0%, rgba(255, 189, 103, 0.34) 6%, rgba(255, 189, 103, 0) 13%),
    radial-gradient(circle at 41% 71%, rgba(255, 223, 174, 0.9) 0%, rgba(255, 176, 95, 0.3) 6%, rgba(255, 176, 95, 0) 13%),
    radial-gradient(circle at 54% 74%, rgba(255, 212, 149, 0.88) 0%, rgba(255, 176, 94, 0.3) 5%, rgba(255, 176, 94, 0) 12%),
    radial-gradient(circle at 64% 73%, rgba(255, 224, 178, 0.9) 0%, rgba(255, 181, 102, 0.3) 6%, rgba(255, 181, 102, 0) 14%),
    radial-gradient(circle at 74% 75%, rgba(255, 213, 146, 0.9) 0%, rgba(255, 168, 88, 0.27) 5%, rgba(255, 168, 88, 0) 12%);
  --blend-mode: screen;
  --layer-opacity: 0.75;
  filter: drop-shadow(0 0 7px rgba(255, 185, 110, 0.46));
  z-index: 14;
}

.foreground-haze {
  background: linear-gradient(to top, rgba(28, 19, 31, 0.75) 0%, rgba(28, 19, 31, 0.22) 38%, rgba(28, 19, 31, 0) 62%);
  mix-blend-mode: multiply;
  opacity: 0.95;
  z-index: 15;
}

.scene:not(.windows-lit) .houses-windows { opacity: 0 }
.scene.is-night .moon { opacity: 0.92 }
.scene:not(.is-night) .moon { opacity: 0.35 }
.scene.is-cloudy .clouds-near { opacity: 0.42 }
.scene:not(.is-cloudy) .clouds-near { opacity: 0.18 }

.main-content {
  position: relative;
  z-index: 20;
  border-radius: 1rem;
  padding: 0.9rem 1.2rem;
  background: rgba(26, 20, 31, 0.22);
}
</style>