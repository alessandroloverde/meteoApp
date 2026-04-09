<script setup>
import { ref, watch } from 'vue'
import { useWeatherStore } from '@/stores/weather.store'
import { searchCities } from '@/composables/useGeocode'
import { fetchWeather } from '@/composables/useWeather'

const store = useWeatherStore()
const query = ref('')
const results = ref([])
const searching = ref(false)
const error = ref(null)

let debounceTimer = null

watch(query, (val) => {
  clearTimeout(debounceTimer)
  error.value = null

  if (!val || val.length < 2) {
    results.value = []
    searching.value = false
    return
  }

  searching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      results.value = await searchCities(val)
    } catch {
      results.value = []
      error.value = 'Search failed. Try again.'
    } finally {
      searching.value = false
    }
  }, 400)
})

async function selectCity(result) {
  store.setCity(result.city, result.country, {
    latitude: result.latitude,
    longitude: result.longitude
  })

  store.setLoading(true)
  try {
    const weather = await fetchWeather(result.latitude, result.longitude)
    store.setWeather(weather)
  } catch {
    store.setError('Failed to load weather for selected city.')
  } finally {
    store.setLoading(false)
  }

  navigateTo('/')
}
</script>

<template>
  <div class="search-page">
    <div class="search-page__header">
      <input
        v-model="query"
        type="text"
        placeholder="Search city..."
        class="search-page__input"
        autocomplete="off"
        autofocus
      />
    </div>

    <p v-if="error" class="search-page__error">{{ error }}</p>

    <p v-if="searching" class="search-page__hint">Searching...</p>

    <p v-else-if="query.length >= 2 && !results.length && !searching" class="search-page__hint">
      No results
    </p>

    <ul v-if="results.length" class="search-page__results">
      <li
        v-for="(r, i) in results"
        :key="i"
        class="search-page__result"
        role="button"
        tabindex="0"
        @click="selectCity(r)"
        @keydown.enter="selectCity(r)"
      >
        <span class="search-page__city">{{ r.city }}</span>
        <span class="search-page__country">{{ r.country }}</span>
      </li>
    </ul>

    <p v-if="store.city && store.source === 'search'" class="search-page__current">
      Current: <strong>{{ store.city }}</strong>
      <button class="search-page__reset" @click="store.resetToGPS()">
        Use GPS instead
      </button>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.search-page {
  display: flex;
  flex-direction: column;
  padding: v.$space-md;
  gap: v.$space-sm;
}

.search-page__header {
  position: sticky;
  top: 0;
  z-index: 1;
  padding-bottom: v.$space-sm;
}

.search-page__input {
  width: 100%;
  padding: v.$space-sm v.$space-md;
  border-radius: v.$radius-full;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: v.$color-surface;
  color: v.$color-text;
  font-size: 0.95rem;
  outline: none;
  transition: border-color v.$transition-fast;

  &::placeholder {
    color: v.$color-text-muted;
  }

  &:focus {
    border-color: v.$color-primary;
  }
}

.search-page__hint {
  text-align: center;
  color: v.$color-text-muted;
  font-size: 0.85rem;
  padding: v.$space-lg 0;
}

.search-page__error {
  text-align: center;
  color: v.$color-error;
  font-size: 0.85rem;
}

.search-page__results {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.search-page__result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: v.$space-sm v.$space-md;
  border-radius: v.$radius-sm;
  cursor: pointer;
  transition: background-color v.$transition-fast;

  &:hover,
  &:focus-visible {
    background: rgba(255, 255, 255, 0.06);
    outline: none;
  }
}

.search-page__city {
  color: v.$color-text;
  font-size: 0.95rem;
}

.search-page__country {
  color: v.$color-text-muted;
  font-size: 0.8rem;
  flex-shrink: 0;
  margin-left: v.$space-sm;
}

.search-page__current {
  text-align: center;
  color: v.$color-text-muted;
  font-size: 0.8rem;
  padding-top: v.$space-lg;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: auto;

  strong {
    color: v.$color-text;
  }
}

.search-page__reset {
  display: block;
  margin: v.$space-sm auto 0;
  padding: v.$space-xs v.$space-md;
  border-radius: v.$radius-full;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: v.$color-primary-light;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color v.$transition-fast;

  &:hover {
    background: rgba(v.$color-primary, 0.1);
  }
}
</style>
