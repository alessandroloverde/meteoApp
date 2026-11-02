import { useWeatherStore } from '@/stores/weather.store'
import { mapWeatherToUI } from '@/utils/weatherMapper'

/**
 * @returns {{ season: string, time: string, weather: string, temp: string } | null}
 */
export function getLiveSceneAxes() {
  const store = useWeatherStore()
  if (!store.weather) return null

  const live = mapWeatherToUI(store.weather)
  return {
    season: live.season,
    time: live.time,
    weather: live.condition,
    temp: live.tempRange,
  }
}

/**
 * Copy the live Open-Meteo → scene mapping into SceneControls.
 * Used for the initial sync and the “Use live weather” reset.
 *
 * @returns {boolean} true when weather was available and controls were updated
 */
export function applyLiveWeatherToSceneControls() {
  const live = getLiveSceneAxes()
  if (!live) return false

  const { season, time, weather, temp } = useSceneControls()
  season.value = live.season
  time.value = live.time
  weather.value = live.weather
  temp.value = live.temp
  return true
}
