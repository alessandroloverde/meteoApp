import { defineStore } from 'pinia'
import { saveLocation, loadLocation, clearLocation } from '@/composables/useLocationStorage'

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface CurrentWeather {
  temperature: number
  weathercode: number
  time: string
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    coords: null as Coordinates | null,
    city: null as string | null,
    country: null as string | null,
    source: 'gps',
    weather: null as CurrentWeather | null,
    loading: false,
    error: null as string | null,
    favoriteCities: [] as string[]
  }),

  actions: {
    setGPS(coords: Coordinates) {
      if (this.source === 'gps') {
        this.coords = coords
        this.city = "Current location"
      }
    },

    setCity(city: string, country: string, coords: Coordinates) {
      this.city = city
      this.country = country
      this.coords = coords
      this.source = 'search'
      saveLocation({ city, country, latitude: coords.latitude, longitude: coords.longitude })
    },

    loadSavedLocation(): boolean {
      const saved = loadLocation()
      if (!saved?.latitude || !saved?.longitude) return false
      this.city = saved.city
      this.country = saved.country ?? null
      this.coords = { latitude: saved.latitude, longitude: saved.longitude }
      this.source = 'search'
      return true
    },

    resetToGPS() {
      clearLocation()
      this.source = 'gps'
      this.city = null
      this.country = null
      this.coords = null
      this.weather = null
    },

    setCountry(country: string) {
      this.country = country
    },

    setWeather(data: CurrentWeather) {
      this.weather = data
    },

    setLoading(val: boolean) {
      this.loading = val
    },

    setError(err: string) {
      this.error = err
    }
  }
})