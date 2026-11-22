import { buildSceneIdentifier } from './sceneIdentifier'

/**
 * Open-Meteo times are location-local ISO strings without an offset
 * (e.g. "2026-11-21T15:00"). Parse parts from the string so we don't depend
 * on the browser timezone via `new Date(...)`.
 */
function parseLocalParts(dateStr) {
  const m = String(dateStr).match(/(\d{4})-(\d{2})-(\d{2})T(\d{2})/)
  if (!m) return null
  return { month: Number(m[2]), hour: Number(m[4]) }
}

// ---- SEASON ----
function getSeason(dateStr) {
  const parts = parseLocalParts(dateStr)
  const month = parts?.month ?? new Date(dateStr).getMonth() + 1

  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// ---- TIME OF DAY ----
function getTimeOfDay(dateStr) {
  const parts = parseLocalParts(dateStr)
  const hour = parts?.hour ?? new Date(dateStr).getHours()

  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 22) return 'evening'
  return 'night'
}
 
 // ---- TEMPERATURE ----
 function mapTemperature(temp) {
   if (temp < -1) return 'frosty'
   if (temp < 10) return 'cold'
   if (temp < 20) return 'mild'
   if (temp < 30) return 'warm'
   return 'hot'
 }
 
 // ---- WEATHER CODE (Open-Meteo) ----
 function mapCondition(code) {
   if (code === 0) return 'clear'
   if ([1, 2].includes(code)) return 'partly_cloudy'
   if (code === 3) return 'cloudy'
   if ([45, 48].includes(code)) return 'fog'
   if ([51, 53, 55].includes(code)) return 'drizzle'
   if ([61, 63, 65].includes(code)) return 'rain'
   if ([80, 81, 82].includes(code)) return 'heavy_rain'
   if ([95, 96, 99].includes(code)) return 'storm'
   if ([71, 73, 75, 77].includes(code)) return 'snow'
 
   return 'clear'
 }

// ---- MAIN MAPPER ----
export function mapWeatherToUI(weather) {
  const season = getSeason(weather.time)
  const time = getTimeOfDay(weather.time)
  const condition = mapCondition(weather.weathercode)
  const tempRange = mapTemperature(weather.temperature)

  const key = buildSceneIdentifier({
    weather: condition,
    season,
    time,
    temp: tempRange,
  })

  return {
     season,
     time,
     condition,
     tempRange,
     key
   }
 }