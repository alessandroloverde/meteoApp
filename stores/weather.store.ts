import { defineStore } from 'pinia'

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
    error: null as string | null
  }),

  actions: {
    setGPS(coords: Coordinates) {
      if (this.source === 'gps') {
        this.coords = coords
      }
    },

    setCity(city: string, coords: Coordinates) {
      this.city = city
      this.coords = coords
      this.source = 'search'
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