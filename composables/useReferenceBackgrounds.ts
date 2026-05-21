/**
 * Reference phone backgrounds: assets under `assets/images/References/`.
 * Build-time glob + `?url`; dropdown uses the file basename.
 *
 * Last-selected filename is restored from localStorage on the client by
 * `plugins/scene-dev-persist.client.js` (key: `meteo-reference-bg`).
 */
const referenceModules = import.meta.glob<string>('~/assets/images/References/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
})

export interface ReferenceBackgroundOption {
  filename: string
  url: string
}

function buildReferenceOptions(): ReferenceBackgroundOption[] {
  return Object.entries(referenceModules)
    .map(([path, url]) => ({
      filename: path.replace(/^.*\//, ''),
      url,
    }))
    .sort((a, b) => a.filename.localeCompare(b.filename))
}

const REFERENCE_OPTIONS = buildReferenceOptions()

export function useReferenceBackgrounds() {
  const options = computed(() => REFERENCE_OPTIONS)

  const selectedFilename = useState<string>('reference-bg-filename', () => {
    return REFERENCE_OPTIONS[0]?.filename ?? ''
  })

  const selectedUrl = computed(() => {
    const hit = REFERENCE_OPTIONS.find((o) => o.filename === selectedFilename.value)
    return hit?.url ?? ''
  })

  return {
    options,
    selectedFilename,
    selectedUrl,
  }
}
