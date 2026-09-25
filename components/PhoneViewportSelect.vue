<template>
  <div class="phone-viewport-select">
    <label for="phone-viewport-select" class="phone-viewport-select__label">
      Viewport
    </label>
    <select
      id="phone-viewport-select"
      class="phone-viewport-select__field"
      :value="viewportId"
      @change="onChange"
    >
      <option
        v-for="opt in options"
        :key="opt.id"
        :value="opt.id"
      >
        {{ opt.label }} — {{ opt.width }}×{{ opt.height }}{{ opt.notch ? ' (notch)' : '' }}
      </option>
    </select>
  </div>
</template>

<script setup>
const { viewportId, options, setViewport } = usePhoneViewport()

function onChange(e) {
  setViewport(e.target.value)
}
</script>

<style scoped lang="scss">
.phone-viewport-select {
  width: 100%;
  max-width: 375px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.phone-viewport-select__label {
  font: 600 10px/1.3 system-ui, sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.phone-viewport-select__field {
  width: 100%;
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
</style>
