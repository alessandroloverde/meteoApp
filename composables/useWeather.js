// Open-Meteo forecast helpers. Current block for “now”; hourly block when the
// timeline picks a day-part (morning / afternoon / evening / night) and/or day.
//
// Normalized shape matches the store's CurrentWeather so the mapper and UI
// keep using `temperature` / `weathercode` / `time`. The scene builder uses
// `temperature` for the temp band; `apparentTemperature` is shown in the dock.

/** Representative local hour for each scene time axis (matches weatherMapper bands). */
export const DAYPART_HOUR = {
  morning: 9,
  afternoon: 15,
  evening: 20,
  /** Default evening-side night; after midnight we use 01:00 instead. */
  night: 23,
}

function normalizeCurrent(c) {
  return {
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    weathercode: c.weathercode,
    time: c.time,
    isDay: c.is_day,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
  }
}

function normalizeHourlyAt(hourly, index) {
  return {
    temperature: hourly.temperature_2m[index],
    apparentTemperature: hourly.apparent_temperature[index],
    weathercode: hourly.weathercode[index],
    time: hourly.time[index],
    isDay: hourly.is_day[index],
    windSpeed: hourly.wind_speed_10m[index],
    windDirection: hourly.wind_direction_10m[index],
  }
}

/** Calendar date arithmetic on YYYY-MM-DD (timezone-safe). */
function addDays(yyyyMmDd, days) {
  const [y, m, d] = yyyyMmDd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + days))
  return dt.toISOString().slice(0, 10)
}

/**
 * Night spans midnight. Before 06:00 use 01:00 (this night); otherwise 23:00
 * so “night” means the upcoming late evening of that calendar day — not
 * yesterday’s early morning.
 */
function resolveDaypartHour(daypart, dayOffset, currentHour) {
  if (daypart === 'night') {
    if (dayOffset === 0 && currentHour < 6) return 1
    return 23
  }
  return DAYPART_HOUR[daypart]
}

export async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weathercode,is_day,wind_speed_10m,wind_direction_10m` +
    `&timezone=auto`

  const res = await fetch(url)
  const data = await res.json()
  return normalizeCurrent(data.current)
}

/**
 * Weather at a representative hour for a day-part.
 * @param {number} lat
 * @param {number} lon
 * @param {'morning'|'afternoon'|'evening'|'night'} daypart
 * @param {number} [dayOffset=0] 0 = today (API local), 1 = tomorrow, …
 */
export async function fetchWeatherAtDaypart(lat, lon, daypart, dayOffset = 0) {
  if (!(daypart in DAYPART_HOUR)) {
    throw new Error(`Unknown daypart: ${daypart}`)
  }

  const forecastDays = Math.min(16, Math.max(1, dayOffset + 1))

  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weathercode,is_day,wind_speed_10m,wind_direction_10m` +
    `&hourly=temperature_2m,apparent_temperature,weathercode,is_day,wind_speed_10m,wind_direction_10m` +
    `&forecast_days=${forecastDays}` +
    `&timezone=auto`

  const res = await fetch(url)
  const data = await res.json()
  const hourly = data.hourly
  const currentTime = data.current?.time

  if (!hourly?.time?.length || !currentTime) {
    throw new Error('No hourly forecast returned.')
  }

  const today = currentTime.slice(0, 10)
  const currentHour = Number(currentTime.slice(11, 13))
  const targetDate = addDays(today, dayOffset)
  const hour = resolveDaypartHour(daypart, dayOffset, currentHour)
  const hourStr = String(hour).padStart(2, '0')

  const index = hourly.time.findIndex(
    (t) => t.startsWith(targetDate) && t.slice(11, 13) === hourStr,
  )

  if (index < 0) {
    throw new Error(`No hourly slot for ${daypart} on ${targetDate} (${hourStr}:00).`)
  }

  return normalizeHourlyAt(hourly, index)
}
