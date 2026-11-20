/**
 * Open-Meteo geocoding matches names in the requested `language`. Searching
 * "Milano" with language=en misses Lombardy Milan and can surface a tiny
 * Umbria hamlet also labeled "Milan, Italy". We query a few languages in
 * parallel, merge by id, and rank by population.
 */
const GEOCODE_LANGS = ['en', 'it', 'de', 'fr', 'es']

function browserLang() {
  if (typeof navigator === 'undefined') return null
  return navigator.language?.slice(0, 2)?.toLowerCase() || null
}

async function fetchGeocode(query, language) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodeURIComponent(query)}` +
    `&count=8` +
    `&language=${encodeURIComponent(language)}`

  const res = await fetch(url)
  const data = await res.json()
  return data.results || []
}

function mapResult(item) {
  return {
    id: item.id,
    displayName: [item.name, item.admin1, item.country].filter(Boolean).join(', '),
    city: item.name,
    admin1: item.admin1 || '',
    country: item.country || '',
    latitude: item.latitude,
    longitude: item.longitude,
    population: item.population ?? 0,
  }
}

export async function searchCities(query) {
  if (!query || query.length < 2) return []

  const langs = [...new Set([browserLang(), ...GEOCODE_LANGS].filter(Boolean))]

  const batches = await Promise.all(langs.map((lang) => fetchGeocode(query, lang)))

  /** @type {Map<number, ReturnType<typeof mapResult>>} */
  const byId = new Map()
  for (const item of batches.flat()) {
    if (!item?.id) continue
    const mapped = mapResult(item)
    const prev = byId.get(mapped.id)
    // Prefer the hit with a higher population; keep first name variant otherwise.
    if (!prev || mapped.population > prev.population) {
      byId.set(mapped.id, mapped)
    }
  }

  return [...byId.values()]
    .sort((a, b) => b.population - a.population)
    .slice(0, 8)
}
