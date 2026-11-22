<script setup>
import { useMobilePreviewMode } from '@/composables/useMobilePreviewMode'

const { override, detected, setOverride } = useMobilePreviewMode()

const PREVIEW_CHOICES = [
  { value: 'auto', label: 'Auto', hint: 'Detect real phones automatically' },
  { value: 'on', label: 'On', hint: 'Always full-bleed, no dev chrome' },
  { value: 'off', label: 'Off', hint: 'Always show the authoring harness' },
]
</script>

<template>
  <div class="settings-page">
    <section class="settings-section">
      <h2 class="settings-section__title">Preview mode</h2>
      <p class="settings-section__hint">
        Hides the reference-art phone and dev controls so the app renders
        full-screen, like it would on a real device.
        <template v-if="override === 'auto'">
          Currently acting as <strong>{{ detected ? 'on' : 'off' }}</strong>
          (auto-detected).
        </template>
      </p>

      <div class="settings-toggle" role="radiogroup" aria-label="Preview mode">
        <button
          v-for="choice in PREVIEW_CHOICES"
          :key="choice.value"
          type="button"
          class="settings-toggle__option"
          :class="{ 'settings-toggle__option--active': override === choice.value }"
          role="radio"
          :aria-checked="override === choice.value"
          @click="setOverride(choice.value)"
        >
          {{ choice.label }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.settings-page {
  display: flex;
  flex-direction: column;
  gap: v.$space-lg;
  padding: calc(var(--status-bar-h, 44px) + #{v.$space-md}) v.$space-md v.$space-md;
  min-height: 100%;
  color: v.$color-text;
}

.settings-section__title {
  font-family: 'Nunito', system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: v.$space-xs;
}

.settings-section__hint {
  font-size: 0.8rem;
  color: v.$color-text-muted;
  line-height: 1.4;
  margin-bottom: v.$space-sm;

  strong {
    color: v.$turquoise;
  }
}

.settings-toggle {
  display: flex;
  gap: v.$space-xs;
  border-radius: v.$radius-full;
  border: 1px solid v.$color-border;
  background: v.$anthracite;
  padding: 4px;
}

.settings-toggle__option {
  flex: 1;
  appearance: none;
  border: 0;
  border-radius: v.$radius-full;
  padding: v.$space-xs v.$space-sm;
  background: transparent;
  color: v.$color-text-muted;
  font: 600 0.8rem/1.2 'Nunito', system-ui, sans-serif;
  cursor: pointer;
  transition: background-color v.$transition-fast, color v.$transition-fast;

  &--active {
    background: v.$color-surface;
    color: v.$turquoise;
  }
}
</style>
