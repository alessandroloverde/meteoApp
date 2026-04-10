export async function searchCities(query) {
  if (!query || query.length < 2) return []

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`
  )

  const data = await res.json()

  if (!data.results) return []

  return data.results.map((item) => ({
    displayName: [item.name, item.admin1, item.country].filter(Boolean).join(', '),
    city: item.name,
    country: item.country || '',
    latitude: item.latitude,
    longitude: item.longitude
  }))
}
