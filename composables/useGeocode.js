export async function searchCities(query) {
  if (!query || query.length < 2) return []

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  )

  const data = await res.json()

  return data.map((item) => ({
    displayName: [
      item.address.city || item.address.town || item.address.village || item.name,
      item.address.state,
      item.address.country
    ].filter(Boolean).join(', '),
    city: item.address.city || item.address.town || item.address.village || item.name,
    country: item.address.country || '',
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon)
  }))
}
