<template>
  <component
    :is="icon"
    class="app-icon"
    :style="sizeStyle"
    :aria-hidden="label ? undefined : true"
    :aria-label="label"
    :role="label ? 'img' : undefined"
  />
</template>

<script setup lang="ts">
import { icons, type IconName } from '~/utils/icons'

const props = defineProps<{
  name: IconName
  /** Omit to size via CSS (e.g. em against parent font-size). */
  size?: number | string
  label?: string
}>()

const icon = computed(() => icons[props.name])

const sizeStyle = computed(() => {
  if (props.size == null) return undefined
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: s, height: s }
})
</script>

<style lang="scss" scoped>
.app-icon {
  display: block;
  flex-shrink: 0;
  color: inherit;
  // Fallback when neither `size` nor a parent rule sets dimensions
  width: 1em;
  height: 1em;
}
</style>
