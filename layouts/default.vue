<template>
  <div class="pageContainer">
    <div class="phoneStage">
    <div class="phoneRow">
      <div class="phoneColumn">
        <label class="reference-bg-label" for="reference-bg-select">Reference background</label>
        <select
          id="reference-bg-select"
          v-model="selectedFilename"
          class="reference-bg-select"
        >
          <option
            v-for="opt in referenceOptions"
            :key="opt.filename"
            :value="opt.filename"
          >
            {{ opt.filename }}
          </option>
        </select>
        <div
          class="phoneContainer phoneContainer--reference"
          aria-hidden="true"
          :style="referencePhoneStyle"
        />
      </div>

      <div class="phoneColumn">
        <PhoneViewportSelect class="scene-controls--above-phone" />
        <div class="phoneScaler" :style="phoneScalerStyle">
          <div class="phoneContainer phoneContainer--app" :style="appPhoneStyle">
            <StatusBar />
          <main class="phoneContainer__main">
            <slot />
          </main>

          <nav class="bottom-nav" aria-label="Primary">
            <NuxtLink
              to="/"
              class="bottom-nav__link"
              :class="{ 'bottom-nav__link--active': route.path === '/' }"
              :aria-current="route.path === '/' ? 'page' : undefined"
              aria-label="Home"
            >
              <svg class="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
              </svg>
            </NuxtLink>

            <NuxtLink
              to="/search"
              class="bottom-nav__link"
              :class="{ 'bottom-nav__link--active': route.path.startsWith('/search') }"
              aria-label="Search city"
            >
              <svg class="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.2-3.2" />
              </svg>
            </NuxtLink>

            <NuxtLink
              to="/settings"
              class="bottom-nav__link"
              :class="{ 'bottom-nav__link--active': route.path.startsWith('/settings') }"
              aria-label="Settings"
            >
              <svg class="bottom-nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </NuxtLink>
          </nav>
          </div>
        </div>
      </div>
    </div>
    <SceneControls class="scene-controls--below-row" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { options: referenceOptions, selectedFilename, selectedUrl } = useReferenceBackgrounds()
const { current: phoneViewport } = usePhoneViewport()

const referencePhoneStyle = computed(() => {
  const u = selectedUrl.value
  if (!u) return {}
  return { backgroundImage: `url(${u})` }
})

// Uniform scale so the tallest model (iPhone 17 Pro Max, 956px) fits in the
// viewport. Applied via `transform: scale()` on the phone, while a wrapper
// reserves the scaled box so layout reflects the true on-screen size. This
// preserves relative size differences between models — e.g. 14 Pro Max and
// 17 Pro Max share an aspect ratio but differ in absolute size, which an
// `aspect-ratio` + `max-height` cap would collapse to the same rendered box.
const TALLEST_MODEL_HEIGHT = 956
const availableHeight = ref<number | null>(null)

function updateAvailableHeight() {
  if (import.meta.client) {
    availableHeight.value = window.innerHeight * 0.88
  }
}

onMounted(() => {
  updateAvailableHeight()
  window.addEventListener('resize', updateAvailableHeight)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateAvailableHeight)
})

const phoneScale = computed(() => {
  if (availableHeight.value == null) return 1
  return Math.min(1, availableHeight.value / TALLEST_MODEL_HEIGHT)
})

const phoneScalerStyle = computed(() => {
  const v = phoneViewport.value
  const s = phoneScale.value
  return {
    width: `${Math.round(v.width * s)}px`,
    height: `${Math.round(v.height * s)}px`,
  }
})

const appPhoneStyle = computed(() => {
  const v = phoneViewport.value
  const s = phoneScale.value
  return {
    width: `${v.width}px`,
    height: `${v.height}px`,
    transform: `scale(${s})`,
    transformOrigin: 'top left',
    '--status-bar-h': v.notch ? '44px' : '20px',
  }
})
</script>

<style lang="scss" scoped>
.reference-bg-label {
  width: 100%;
  max-width: 375px;
  font: 600 10px/1.3 system-ui, sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.reference-bg-select {
  width: 100%;
  max-width: 375px;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 10px;
  font: 12px/1.3 system-ui, sans-serif;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.45);
    outline-offset: 2px;
  }

  option {
    background: #1c1c1c;
    color: #fff;
  }
}

.scene-controls--above-phone {
  width: 100%;
  max-width: 375px;
}

// SceneControls below the row — spans both phone columns (full phoneStage
// width) and collapses its four selects into a single 4-column row.
.scene-controls--below-row {
  width: 100%;
}

.phoneStage {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: v.$space-md;
}

// Wrapper that reserves the scaled box for the app phone. The phone inside
// renders at its true model dimensions and is shrunk via `transform: scale()`,
// so the status bar, notch, and scene all scale together while the layout
// around it sees the correct on-screen footprint.
.phoneScaler {
  position: relative;
}

.bottom-nav {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: v.$space-sm;
  padding: v.$space-sm v.$space-md calc(v.$space-sm + env(safe-area-inset-bottom, 0px));
  background-color: rgba(v.$color-surface, 0.5);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.bottom-nav__link {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border-radius: v.$radius-md;
  color: v.$color-text-muted;
  transition: color v.$transition-fast, background-color v.$transition-fast;

  &:focus-visible {
    outline: 2px solid v.$color-primary;
    outline-offset: 2px;
  }

  &:hover {
    color: v.$color-text;
    background-color: rgba(255, 255, 255, 0.04);
  }

  &--active {
    color: v.$color-primary-light;
    background-color: rgba(v.$color-primary, 0.12);
  }
}

.bottom-nav__icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
}
</style>
