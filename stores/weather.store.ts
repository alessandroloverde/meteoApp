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
    source: 'gps' as 'gps' | 'ip' | 'search',
    weather: null as CurrentWeather | null,
    loading: false,
    error: null as string | null,
    locationNotice: null as string | null,
    favoriteCities: [] as string[]
  }),

  actions: {
    setGPS(coords: Coordinates) {
      this.source = 'gps'
      this.coords = coords
      this.city = 'Current location'
      this.locationNotice = null
      this.error = null
    },

    setIpLocation(coords: Coordinates, city: string, country: string | null, notice?: string) {
      this.source = 'ip'
      this.coords = coords
      this.city = city
      this.country = country
      this.locationNotice = notice ?? 'Approximate location from your network (GPS unavailable in this browser).'
      this.error = null
    },

    setCity(city: string, country: string, coords: Coordinates) {
      this.city = city
      this.country = country
      this.coords = coords
      this.source = 'search'
      this.locationNotice = null

      saveLocation({ city, country, latitude: coords.latitude, longitude: coords.longitude })
    },

    loadSavedLocation(): boolean {
      const saved = loadLocation()

      if (!saved?.latitude || !saved?.longitude) return false

      this.city = saved.city
      this.country = saved.country ?? null
      this.coords = { latitude: saved.latitude, longitude: saved.longitude }
      this.source = 'search'
      this.locationNotice = null
      
      return true
    },

    resetToGPS() {
      clearLocation()

      this.source = 'gps'
      this.city = null
      this.country = null
      this.coords = null
      this.weather = null
      this.locationNotice = null
      this.error = null
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

    setError(err: string | null) {
      this.error = err
    }
  }
})