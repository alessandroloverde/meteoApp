import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    coords: null,
    city: null,
    country: null,
    source: 'gps',
    weather: null,
    loading: false,
    error: null
  }),

  actions: {
    setGPS(coords) {
      if (this.source === 'gps') {
        this.coords = coords
      }
    },

    setCity(city, coords) {
      this.city = city
      this.coords = coords
      this.source = 'search'
    },

    setCountry(country) {
      this.country = country
    },

    setWeather(data) {
      this.weather = data
    },

    setLoading(val) {
      this.loading = val
    },

    setError(err) {
      this.error = err
    }
  }
})