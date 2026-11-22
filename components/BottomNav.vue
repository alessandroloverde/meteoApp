<script setup>
const route = useRoute()

const NAV_ITEMS = [
  { to: '/', icon: 'weather', label: 'weather', match: (p) => p === '/' },
  { to: '/search', icon: 'cities', label: 'cities', match: (p) => p.startsWith('/search') },
  { to: '/settings', icon: 'settings', label: 'settings', match: (p) => p.startsWith('/settings') },
]
</script>

<template>
  <nav class="bottom-nav" aria-label="Primary">
    <NuxtLink
      v-for="item in NAV_ITEMS"
      :key="item.to"
      :to="item.to"
      class="bottom-nav__link"
      :class="{ 'bottom-nav__link--active': item.match(route.path) }"
      :aria-current="item.match(route.path) ? 'page' : undefined"
    >
      <AppIcon :name="item.icon" :size="26" class="bottom-nav__icon" />
      <span class="bottom-nav__label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style lang="scss" scoped>
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
  font-family: 'Nunito', system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: inherit;
}
</style>
