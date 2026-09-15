// Open-Meteo current forecast. Uses the flexible `current` block (not the
// legacy `current_weather=true` shortcut) so we can request `apparent_temperature`
// alongside the fields the scene builder needs.
//
// Raw `current` block fields: time, interval, temperature_2M, apparent_temperature,
// is_day, weathercode, wind_speed_10m, wind_direction_10m.
//
// We normalize to the store's CurrentWeather shape so the mapper and UI keep
// using `temperature` / `weathercode` / `time`. The scene builder consumes
// `temperature` (raw air temp) for the temp band; `apparentTemperature` is
// surfaced separately in the weather panel.
export async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,weathercode,is_day,wind_speed_10m,wind_direction_10m` +
    `&timezone=auto`

  const res = await fetch(url)
  const data = await res.json()
  const c = data.current

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
