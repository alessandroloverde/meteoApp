const GEO_ERROR = {
  1: 'Location permission denied.',
  2: 'Location unavailable.',
  3: 'Location request timed out.',
}

async function permissionState() {
  try {
    if (!navigator.permissions?.query) return null
    const status = await Promise.race([
      navigator.permissions.query({ name: 'geolocation' }),
      new Promise((resolve) => setTimeout(() => resolve({ state: null }), 1500)),
    ])
    return status?.state ?? null
  } catch {
    return null
  }
}

function policyAllowsGeolocation() {
  try {
    if (document.permissionsPolicy?.allowsFeature) {
      return document.permissionsPolicy.allowsFeature('geolocation')
    }
    if (document.featurePolicy?.allowsFeature) {
      return document.featurePolicy.allowsFeature('geolocation')
    }
  } catch {
    /* ignore */
  }
  return null
}

function formatGpsError(err, sitePermission) {
  const policy = policyAllowsGeolocation()
  const detail = [
    `code=${err.code}`,
    `sitePermission=${sitePermission ?? 'unknown'}`,
    `policy=${policy === null ? 'unknown' : policy}`,
    `host=${location.host}`,
    `secure=${window.isSecureContext}`,
  ].join(', ')

  if (policy === false) {
    return `Geolocation is blocked by Permissions-Policy (extension or header). (${detail})`
  }

  if (err.code === 1) {
    return (
      `GPS blocked by Chrome/browser (${detail}). ` +
      'Reset this site under chrome://settings/content/location — then reload. ' +
      'Using network location if available.'
    )
  }

  return `${GEO_ERROR[err.code] || err.message || 'Unable to get GPS location.'} (${detail})`
}

/** Browser GPS (precise). Does not wait on Permissions API — that can hang in Chrome. */
export function getGpsLocation(options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Geolocation is only available in the browser.'))
      return
    }

    if (!window.isSecureContext) {
      reject(
        new Error(
          'Geolocation requires HTTPS or localhost. Open via http://localhost (not a LAN IP).',
        ),
      )
      return
    }

    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    // Query in parallel for diagnostics only — never gate the GPS call on it.
    const sitePermissionPromise = permissionState()

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => {
        sitePermissionPromise.then((sitePermission) => {
          reject(new Error(formatGpsError(err, sitePermission)))
        })
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 5 * 60_000,
        ...options,
      },
    )
  })
}

/** Coarse location from public IP — works when Chrome GPS is broken. */
export async function getIpLocation() {
  const providers = [
    async () => {
      const res = await fetch('https://get.geojs.io/v1/ip/geo.json')
      if (!res.ok) throw new Error('geojs failed')
      const data = await res.json()
      return {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        city: data.city || data.region || 'Approximate location',
        country: data.country || null,
      }
    },
    async () => {
      const res = await fetch('https://ipwho.is/')
      if (!res.ok) throw new Error('ipwho failed')
      const data = await res.json()
      if (!data.success) throw new Error('ipwho failed')
      return {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        city: data.city || data.region || 'Approximate location',
        country: data.country || null,
      }
    },
  ]

  let lastError = null
  for (const provider of providers) {
    try {
      const loc = await provider()
      if (!Number.isFinite(loc.latitude) || !Number.isFinite(loc.longitude)) {
        throw new Error('invalid coordinates')
      }
      return loc
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('Network location lookup failed.')
}

/**
 * Prefer GPS; fall back to IP. IP lookup starts immediately so Chrome
 * users are not stuck waiting on a denied/hanging GPS prompt.
 */
export async function getBestLocation(options = {}) {
  const gpsPromise = getGpsLocation(options)
  const ipPromise = getIpLocation().catch((err) => {
    throw err
  })

  try {
    const coords = await gpsPromise
    return { coords, source: 'gps' }
  } catch (gpsErr) {
    try {
      const ip = await ipPromise
      return {
        coords: { latitude: ip.latitude, longitude: ip.longitude },
        city: ip.city,
        country: ip.country,
        source: 'ip',
        gpsError: gpsErr.message,
      }
    } catch {
      throw gpsErr
    }
  }
}

export function useLocation() {
  return { getLocation: getGpsLocation, getGpsLocation, getIpLocation, getBestLocation }
}
