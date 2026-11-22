<template>
  <div>
    <!-- Preview mode: full-bleed, no dev chrome — what a real device sees. -->
    <div
      v-if="isPreview"
      class="phoneContainer phoneContainer--preview"
      :style="previewPhoneStyle"
    >
      <main class="phoneContainer__main">
        <slot />
      </main>

      <BottomNav />
    </div>

    <!-- Authoring harness: reference art + app phone + dev controls. -->
    <div v-else class="pageContainer">
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

              <BottomNav />
            </div>
          </div>
        </div>
        <SceneControls class="scene-controls--below-row" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMobilePreviewMode } from '@/composables/useMobilePreviewMode'

const { options: referenceOptions, selectedFilename, selectedUrl } = useReferenceBackgrounds()
const { current: phoneViewport, SCENE_BASE_HEIGHT } = usePhoneViewport()
const { isPreview } = useMobilePreviewMode()

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

// Real viewport, real safe areas — no JS measurement needed, CSS does it.
// `--status-bar-h` reads the device's actual top inset (no fake StatusBar
// here; the OS already draws the real one). `--phone-h: 100dvh` feeds the
// same "extra height" scene scaling the dev harness uses for tall iPhones.
const previewPhoneStyle = {
  '--status-bar-h': 'env(safe-area-inset-top, 20px)',
  '--phone-h': '100dvh',
  '--scene-base-h': `${SCENE_BASE_HEIGHT}px`,
}
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
</style>
