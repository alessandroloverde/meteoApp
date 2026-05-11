<script setup>
const {
  season, time, weather, temp,
  SCENE_SEASONS, SCENE_TIMES, SCENE_WEATHERS, SCENE_TEMPS,
} = useSceneControls()
</script>

<template>
  <div
    class="scene-controls"
    role="group"
    aria-label="Scene theming controls (development)"
  >
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
</template>

<style scoped lang="scss">
.scene-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #fff;
  font: 12px/1.4 system-ui, sans-serif;
  // Heavy when composited over the GPU‑masked scene; keep blur subtle for INP/LCP.
  backdrop-filter: blur(4px);
}

.scene-controls__field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 110px;
}

.scene-controls__label {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
}

.scene-controls__select {
  appearance: none;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 6px;
  padding: 5px 8px;
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

  // Native option styling — dark background so options are readable
  // on both macOS and Windows.
  option {
    background: #1c1c1c;
    color: #fff;
  }
}
</style>
