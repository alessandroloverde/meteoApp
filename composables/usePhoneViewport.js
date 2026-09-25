// Shared reactive state for the right-hand (app) phone viewport.
// Lets the Weather Scene Generator preview how the background scene adapts
// across iPhone models with different aspect ratios and notch styles.
//
// Used by:
//   • <PhoneViewportSelect> (dropdown above the app phone)
//   • layouts/default.vue (binds the app phone's width/height/aspect-ratio)
//   • <StatusBar> (notch vs. thin bar)
//
// Dimensions are CSS px (iPhone "points"). Notch flag drives the status bar
// style: true  → 44px bar with iPhone X-style notch
//              false → 20px thin bar (iPhone 8 / SE)

export const PHONE_VIEWPORTS = [
  { id: 'iphone-8',           label: 'iPhone 8',           width: 375, height: 667,  notch: false },
  { id: 'iphone-x',           label: 'iPhone X',            width: 375, height: 812,  notch: true  },
  { id: 'iphone-14-pro-max',  label: 'iPhone 14 Pro Max',  width: 430, height: 932,  notch: true  },
  { id: 'iphone-17-pro-max',  label: 'iPhone 17 Pro Max',  width: 440, height: 956,  notch: true  },
]

const DEFAULT_ID = 'iphone-8'

export function usePhoneViewport() {
  const viewportId = useState('phone-viewport', () => DEFAULT_ID)

  const current = computed(() =>
    PHONE_VIEWPORTS.find(v => v.id === viewportId.value)
    ?? PHONE_VIEWPORTS.find(v => v.id === DEFAULT_ID)
  )

  function setViewport(id) {
    viewportId.value = id
  }

  return {
    viewportId,
    current,
    options: PHONE_VIEWPORTS,
    setViewport,
  }
}
