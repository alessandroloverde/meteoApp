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
            >
              <AppIcon name="weather" :size="26" class="bottom-nav__icon" />
              <span class="bottom-nav__label">weather</span>
            </NuxtLink>

            <NuxtLink
              to="/search"
              class="bottom-nav__link"
              :class="{ 'bottom-nav__link--active': route.path.startsWith('/search') }"
            >
              <AppIcon name="cities" :size="26" class="bottom-nav__icon" />
              <span class="bottom-nav__label">cities</span>
            </NuxtLink>

            <NuxtLink
              to="/settings"
              class="bottom-nav__link"
              :class="{ 'bottom-nav__link--active': route.path.startsWith('/settings') }"
            >
              <AppIcon name="settings" :size="26" class="bottom-nav__icon" />
              <span class="bottom-nav__label">settings</span>
            </NuxtLink>
          </nav>
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
const { current: phoneViewport, SCENE_BASE_HEIGHT } = usePhoneViewport()

const referencePhoneStyle = computed(() => {
  const u = selectedUrl.value
  if (!u) return {}
  return { backgroundImage: `url(${u})` }
})

// App phone at true model points (no scale). Page scrolls when a tall model
// exceeds the browser window — preferred for accurate scene / inspector checks.
const appPhoneStyle = computed(() => {
  const v = phoneViewport.value
  return {
    width: `${v?.width}px`,
    height: `${v?.height}px`,
    '--status-bar-h': v?.notch ? '44px' : '20px',
    '--phone-h': `${v?.height}px`,
    '--scene-base-h': `${SCENE_BASE_HEIGHT}px`,
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 64px;
  min-height: 44px;
  padding: 4px 8px;
  border-radius: v.$radius-md;
  color: var(--icon-muted);
  transition: color v.$transition-fast, background-color v.$transition-fast;

  &:focus-visible {
    outline: 2px solid var(--icon-accent);
    outline-offset: 2px;
  }

  &:hover {
    color: var(--icon-accent);
    background-color: rgba(255, 255, 255, 0.04);
  }

  &--active {
    color: var(--icon-accent);
    background-color: rgba(v.$accent-color, 0.12);
  }
}

.bottom-nav__icon {
  flex-shrink: 0;
  color: inherit;
}

.bottom-nav__label {
  font-family: 'Nunito Sans', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: inherit;
}
</style>
