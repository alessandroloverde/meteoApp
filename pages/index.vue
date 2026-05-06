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
      <div class="scene-layer sky-base">
        <secttion class="top-clouds">
          <div class="cloud-1-wrap">
            <div class="scene-layer cloud-1"></div>
          </div>
          <div class="scene-layer cloud-2"></div>
          <div class="scene-layer cloud-3"></div>
          <div class="scene-layer moon"></div>
          <div class="scene-layer cloud-4"></div>
        </secttion>
        <secttion class="bottom-clouds">
          <div class="cloud-1--low-wrap">
            <div class="scene-layer cloud-1--low"></div>
          </div>
         <!--  <div class="scene-layer cloud-1--low"></div> -->
          <div class="scene-layer cloud-2--low"></div>
          <div class="scene-layer cloud-3--low"></div>
          <div class="scene-layer cloud-4--low"></div>
        </secttion>
      </div>


      <div class="scene-layer mask-layer terrain">

        <section class="scene-layer mask-layer bushes-in-front" style="z-index: 10">
          <div class="bushes-1"></div>
          <div class="trees-1">
            <div class="trees-1--trunk"></div>
            <div class="trees-1--foliage"></div>
          </div>
          <div class="bushes-2"></div>
          <div class="trees-4">
            <div class="trees-4--trunk"></div>
            <div class="trees-4--foliage"></div>
          </div>
        </section>

        <div class="scene-layer mask-layer terrain-1" style="z-index: 9"></div>

        <div class="scene-layer mask-layer terrain-2" style="z-index: 8">
          <div class="bushes-3"></div>
        </div>

        <section class="scene-layer mask-layer bushes-in-front" style="z-index: 7">
          <div class="trees-2">
            <div class="trees-2--trunk"></div>
            <div class="trees-2--foliage"></div>
          </div>
          <div class="trees-3">
            <div class="trees-3--trunk"></div>
            <div class="trees-3--foliage"></div>
          </div>
        </section>

        <section class="scene-layer mask-layer bushes-in-front" style="z-index: 6;">
          <div class="trees-5">
            <div class="trees-5--trunk"></div>
            <div class="trees-5--foliage"></div>
          </div>
        </section>

        <div class="scene-layer mask-layer terrain-3" style="z-index: 5"></div>

        <section class="scene-layer" style="z-index: 4">
          <div class="houseBlock--main">
            <div class="houseBlock--main--windows"></div>
            <div class="houseBlock--main--roofs"></div>
          </div>
          <div class="houseBlock--church"></div>
          <div class="houseBlock--left">
            <div class="houseBlock--left--roofs"></div>
            <div class="houseBlock--left--windows"></div>
          </div>
        </section>

        <div class="scene-layer mask-layer terrain-4" style="z-index: 3"></div>

        <div class="scene-layer terrain-5" style="z-index: 3"></div>

        <section class="scene-layer" style="z-index: 1">
          <div class="houseBlock--small">
            <div class="houseBlock--small--windows"></div>
          </div>
        </section>

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
@use 'sass:color';
@use 'sass:list';
@use '~/assets/scss/mixins' as mx;

$autumn-palette: (
  "bushes": (
    "1-lighter": #c17122,
    "1-light": #ae5e19,
    "1-med": #673611,
    "1-dark": #412415,
    "3-light": #432616,
    "3-dark": #81481a,
  )
);

// Per-tree config. Add a new entry here to render a new tree;
$trees: (
  1: (
    width: calc(112px / 2),
    height: calc(194px / 2),
    offset: (right: 0%, top: -19%),
    z-index: 10,
    trunk-colors: (#5f1203, #281416),
    foliage-colors: linear-gradient(125deg, #d06c33 10%, #421f20 95%),
    trunk-mask-size: 100% auto,
    trunk-mask-position: 40% bottom,
  ),
  2: (
    width: calc(52px / 2),
    height: calc(102px / 2),
    offset: (right: 13%, top: -6%),
    z-index: 9,
    trunk-colors: (#2c1313, #281416),
    foliage-colors: linear-gradient(125deg, #ec8b1b 10%, #421f20 95%),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 40% bottom,
  ),
  3: (
    width: calc(79px / 2),
    height: calc(100px / 2),
    offset: (right: 21%, top: -6%),
    z-index: auto,
    trunk-colors: (#2c1313, #281416),
    foliage-colors: linear-gradient(125deg, #ec8b1b 10%, #421f20 95%),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 55% 150%,
  ),
  4: (
    width: calc(51px / 2),
    height: calc(99px / 2),
    offset: (left: 8%, top: -5%),
    z-index: 7,
    trunk-colors: (#2c1313, #281416),
    foliage-colors: linear-gradient(125deg, #ec8b1b 10%, #421f20 95%),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 55% 150%,
  ),
  5: (
    width: calc(64px / 2),
    height: calc(122px / 2),
    offset: (left: 1.5%, top: -11%),
    z-index: 6,
    trunk-colors: (#2c1313, #281416),
    foliage-colors: linear-gradient(-90deg, #984022 10%, #4c2220 95%),
    trunk-mask-size: 50% auto,
    trunk-mask-position: 50% 180%,
  ),
);

@each $key, $config in $trees {
  .trees-#{$key} {
    @include mx.tree($key, $config);
  }
}

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
$terrain-5-colors: (
  "accent": #af6a2c,
  "darkBrown": #813a1a,
  "medBrown": #7f3918
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
  //inset: 0;
  width: 100%;
  height: 100%;
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
}
.terrain {
  height: 55%;
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

/* ––– Buildings ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
.houseBlock--church {
  @include mx.house-block(church, (
    width: calc(68px / 2),
    height: calc(44px / 2),
    offset: (top: -2%, left: 17%),
    background: linear-gradient(45deg, #4b2128 10%, #b84d2d 100%),
    z-index: 2,
  ));

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('~/assets/images/masks/HouseBlock--church.svg') center center / 100% auto no-repeat;
    mix-blend-mode: soft-light;
    opacity: 0.7;
  }
  &::after {
    content: '';
    @include mx.house-block-layer(church, windows, png, (
      background: #f8bd7e,
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
      background: color.scale(#4a2229, $lightness: 10%),
      mask-position: center top,
    ));
  }
  &--windows {
    @include mx.house-block-layer(left, windows, png, (
      background: #f8bd7e,
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
      background: #f8bd7e,
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
      background: #f8bd7e,
      opacity: 0.9,
    ));
  }
  &--roofs {
    @include mx.house-block-layer(main, roofs, png, (
      background: color.scale(#4a2229, $lightness: 20%),
      mask-position: center -2px,
    ));
  }
}
/* ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */


.moon {
  background-image: url('~/assets/images//Moon--full.png');
  background-size: 100% auto;
  background-position: center center;
  background-repeat: no-repeat;
  width:calc(260px / 2);
  height: calc(260px / 2);
  z-index: 2;
  position: absolute;
  top: 37%;
  left: 4%;
  filter: blur(2px);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle at center, 
      rgba(255, 255, 255, 0.5) 0%, 
      rgba(255, 255, 255, 0) 100%);
    mix-blend-mode: soft-light;
    opacity: 0.5;
    filter: blur(5px);
  }
}

/* ––– Clouds –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– */
$clouds: (
  1: (
    dimensions: (width: inherit, height: inherit),
    bkg: linear-gradient(to bottom, #595a6c 0%, #7b7d88 100%),
    mask-type: svg,
    opacity: 1,
    z-index: 4,
    has-gradient-mask: true,
  ),
  2: (
    dimensions: (width: calc(260px / 2), height: calc(108px / 2)),
    position: (left: 0, top: 40%),
    bkg: linear-gradient(to left, #b4b5a9 0%, #868793 100%),
    mask-type: svg,
    opacity: 0.8,
    z-index: 3,
    filter: blur(8px),
  ),
  3: (
    dimensions: (width: calc(317px / 2), height: calc(148px / 2)),
    position: (right: -7%, top: 41%),
    bkg: linear-gradient(0deg, #878795 0%, #535161 50%),
    mask-type: svg,
    z-index: 3,
  ),
  4: (
    dimensions: (width: calc(673px / 2), height: calc(208px / 2)),
    position: (right: -15%, top: 46%),
    bkg: #74747b,
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
    bkg: radial-gradient(circle at 40% 30%, #8f8d93 10%, #56505b 62%),
    mask-type: png,
    opacity: 1,
    z-index: auto,
  ),
  2: (
    dimensions: (width: calc(694px / 2), height: calc(265px / 2)),
    position: (right: -8%, bottom: -6%),
    bkg: radial-gradient(circle at 45% 15%, #96949d 0%, #716b79 60%),
    mask-type: svg,
    opacity: 1,
    z-index: 3,
  ),
  3: (
    dimensions: (width: calc(546px / 2), height: calc(229px / 2)),
    position: (left: -5%, bottom: 0),
    bkg: radial-gradient(circle at 45% 15%, #96949d 0%, #716b79 60%),
    mask-type: svg,
    opacity: 0.25,
    z-index: 3,
    mix-blend-mode: screen,
  ),
  4: (
    dimensions: (width: calc(608px / 2), height: calc(334px / 2)),
    position: (left: -15%, bottom: -5%),
    bkg: radial-gradient(circle at 46% 40%, #96949d 0%, #6d6775 46%),
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

.top-clouds,
.bottom-clouds {
  position: relative;
  display: block;
  width: 100%;
  height: 50%;
  z-index: 2;
}
.top-clouds { z-index: 3 }
.bottom-clouds { opacity: 0.8}

.cloud-1-wrap {
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
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
  --mask-image: url('~/assets/images/masks/Terrain-5--bkg.svg');
  --mask-gradient: url('~/assets/images/masks/Terrain-5--gradient.png');
  --layer-bkg: #{map.get($terrain-5-colors, darkBrown)};
  --accent-color: #{map.get($terrain-5-colors, accent)};
  --blend-mode: color;
  --layer-opacity: 1;

/*   background: linear-gradient(
    -45deg,
    #{map.get($terrain-5-colors, accent)} 65%,
    #{map.get($terrain-5-colors, medBrown)} 45%, 
    #{map.get($terrain-5-colors, darkBrown)} 75%
  ); */
  background-color: #80391a;
  -webkit-mask: var(--mask-image) var(--mask-position, bottom center) / var(--mask-size, 100% auto) no-repeat;
          mask: var(--mask-image) var(--mask-position, bottom center) / var(--mask-size, 100% auto) no-repeat;
  z-index: 7;
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
  z-index: auto;
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

.foreground-haze {
  background: linear-gradient(to top, rgba(28, 19, 31, 0.75) 0%, rgba(28, 19, 31, 0.22) 38%, rgba(28, 19, 31, 0) 62%);
  mix-blend-mode: multiply;
  opacity: 0.95;
  z-index: 15;
}



.main-content {
  position: relative;
  z-index: 20;
  border-radius: 1rem;
  padding: 0.9rem 1.2rem;
  background: rgba(26, 20, 31, 0.22);
}
</style>