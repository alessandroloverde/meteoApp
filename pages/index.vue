<script setup>
import { onMounted } from 'vue'
import { useWeatherStore } from '@/stores/weather.store'
import { useLocation } from '@/composables/useLocation'
import { fetchWeather } from '@/composables/useWeather'
import { mapWeatherToUI } from '@/utils/weatherMapper'
import { reverseGeocode } from '@/composables/useReverseGeocoding'

const store = useWeatherStore()
const { getLocation } = useLocation()

onMounted(async () => {
  try {
    store.setLoading(true)

    // 1. GPS
    const coords = await getLocation()
    store.setGPS(coords)

    // 2. Fetch meteo
    const weather = await fetchWeather(
      coords.latitude,
      coords.longitude
    )

    store.setWeather(weather)

    const location = await reverseGeocode(coords.latitude, coords.longitude)
    store.city = location.city
    store.country = location.country
  } catch (err) {
    store.setError(err.message)
  } finally {
    store.setLoading(false)
  }
})

const ui = computed(() => {
  if (!store.weather) return null

  return mapWeatherToUI(store.weather)
})
</script>

<template>
<div class="flex justify-center items-center min-h-screen bg-neutral-900">
   <div class="w-[375px] h-[667px] bg-black rounded-[40px] overflow-hidden shadow-2xl">
      <div class="text-center">
         
         <div v-if="store.loading">Loading...</div>
         
         <div v-else-if="store.error">Error: {{ store.error }}</div>

         <div v-else-if="store.weather">
            <h1 class="text-6xl font-bold">{{ store.weather.temperature }}°</h1>
            <p class="mt-2 text-lg">Weather code: {{ store.weather.weathercode }}</p>
         </div>

         <div v-if="ui">
            <p class="mt-4 text-sm">{{ ui.key }}</p>
         </div>

         <div v-if="store.city">
            <p class="mt-4 text-sm">{{ store.city }} - {{ store.country }}</p>
         </div>

      </div>
   </div>
  </div>
</template>