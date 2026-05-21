import {
  loadSceneControls,
  saveSceneControls,
} from '@/composables/useSceneControlsStorage'
import { loadReferenceBackgroundFilename, saveReferenceBackgroundFilename } from '@/composables/useReferenceBackgroundStorage'
import {
  SCENE_SEASONS,
  SCENE_TEMPS,
  SCENE_TIMES,
  SCENE_WEATHERS,
} from '@/composables/useSceneControls'

function applySavedSceneControls(season, time, weather, temp) {
  const saved = loadSceneControls()
  if (!saved) return

  if (SCENE_SEASONS.includes(saved.season)) season.value = saved.season
  if (SCENE_TIMES.includes(saved.time)) time.value = saved.time
  if (SCENE_WEATHERS.includes(saved.weather)) weather.value = saved.weather
  if (SCENE_TEMPS.includes(saved.temp)) temp.value = saved.temp
}

function applySavedReferenceBackground(selectedFilename, options) {
  const saved = loadReferenceBackgroundFilename()
  if (!saved) return
  if (options.some((o) => o.filename === saved)) {
    selectedFilename.value = saved
  }
}

export default defineNuxtPlugin(() => {
  const { season, time, weather, temp } = useSceneControls()
  applySavedSceneControls(season, time, weather, temp)

  watch([season, time, weather, temp], ([s, t, w, tm]) => {
    saveSceneControls({ season: s, time: t, weather: w, temp: tm })
  })

  const { selectedFilename, options } = useReferenceBackgrounds()
  applySavedReferenceBackground(selectedFilename, options.value)

  watch(selectedFilename, (filename) => {
    if (filename) saveReferenceBackgroundFilename(filename)
  })
})
