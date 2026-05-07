// Shared reactive state for the four scene-theming axes that drive
// `data-season` / `data-time` / `data-weather` / `data-temp` on `.scene`.
//
// Used by:
//   • <SceneControls> (the dev/test dropdowns above the phones)
//   • pages/index.vue (binds `.scene`'s data-* attributes to these refs)
//
// Vocabularies match `mapWeatherToUI` in `utils/weatherMapper.js` and the
// variant selectors in `assets/scss/_theme.scss`. Keep all three in sync
// when adding/removing values.

export const SCENE_SEASONS = ['spring', 'summer', 'autumn', 'winter']

export const SCENE_TIMES = ['morning', 'afternoon', 'evening', 'night']

export const SCENE_WEATHERS = [
  'clear',
  'partly_cloudy',
  'cloudy',
  'fog',
  'drizzle',
  'rain',
  'heavy_rain',
  'storm',
  'snow',
]

export const SCENE_TEMPS = ['frosty', 'cold', 'mild', 'warm', 'hot']

export function useSceneControls() {
  // `useState` (Nuxt) shares the value across all components on the page,
  // so the dev dropdowns and the consuming `<div class="scene">` stay in sync.
  const season = useState('scene-season', () => 'autumn')
  const time = useState('scene-time', () => 'evening')
  const weather = useState('scene-weather', () => 'partly_cloudy')
  const temp = useState('scene-temp', () => 'warm')

  return {
    season,
    time,
    weather,
    temp,

    SCENE_SEASONS,
    SCENE_TIMES,
    SCENE_WEATHERS,
    SCENE_TEMPS,
  }
}
