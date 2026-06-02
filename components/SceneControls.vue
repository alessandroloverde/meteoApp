<script setup>
import { computed } from 'vue'
import { buildSceneIdentifier } from '@/utils/sceneIdentifier'
import { resolveScenePaintBundle } from '@/utils/scenePaint'

const {
  season, time, weather, temp,
  SCENE_SEASONS, SCENE_TIMES, SCENE_WEATHERS, SCENE_TEMPS,
} = useSceneControls()

const sceneId = computed(() =>
  buildSceneIdentifier({
    weather: weather.value,
    season: season.value,
    time: time.value,
    temp: temp.value,
  }),
)

const paintBundle = computed(() => resolveScenePaintBundle(sceneId.value))
</script>

<template>
  <div
    class="scene-controls"
    role="group"
    aria-label="Scene theming controls (development)"
  >
    <p class="scene-controls__scene-id" title="weather--season--time--temp">
      {{ sceneId }}
    </p>
    <p
      v-if="paintBundle"
      class="scene-controls__paint-bundle"
      title="season--weather--variant (paint library)"
    >
      paint: {{ paintBundle }}
    </p>
    <p v-else class="scene-controls__paint-bundle scene-controls__paint-bundle--missing">
      paint: (no library branch)
    </p>
    <div class="scene-controls__row">
      <label class="scene-controls__field">
        <span class="scene-controls__label">Season</span>
        <select v-model="season" class="scene-controls__select">
          <option v-for="opt in SCENE_SEASONS" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>

      <label class="scene-controls__field">
        <span class="scene-controls__label">Time</span>
        <select v-model="time" class="scene-controls__select">
          <option v-for="opt in SCENE_TIMES" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>
    </div>

    <div class="scene-controls__row">
      <label class="scene-controls__field">
        <span class="scene-controls__label">Weather</span>
        <select v-model="weather" class="scene-controls__select">
          <option v-for="opt in SCENE_WEATHERS" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>

      <label class="scene-controls__field">
        <span class="scene-controls__label">Temp</span>
        <select v-model="temp" class="scene-controls__select">
          <option v-for="opt in SCENE_TEMPS" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scene-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #fff;
  font: 12px/1.4 system-ui, sans-serif;
  backdrop-filter: blur(4px);
}

.scene-controls__paint-bundle {
  margin: 0;
  padding: 0 2px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  opacity: 0.85;
}

.scene-controls__paint-bundle--missing {
  color: #f5a623;
}

.scene-controls__scene-id {
  margin: 0;
  padding: 0 2px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  line-height: 1.35;
  word-break: break-all;
  color: rgba(255, 255, 255, 0.72);
}

.scene-controls__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  width: 100%;
}

.scene-controls__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.scene-controls__label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
}

.scene-controls__select {
  width: 100%;
  min-width: 0;
  appearance: none;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 6px;
  padding: 6px 8px;
  font: inherit;
  cursor: pointer;
  transition: border-color 120ms ease, background-color 120ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }

  &:focus-visible {
    outline: none;
    border-color: rgba(255, 255, 255, 0.45);
  }

  option {
    background: #1c1c1c;
    color: #fff;
  }
}
</style>
