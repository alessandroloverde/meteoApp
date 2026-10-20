import Cities from '~/assets/icons/cities.svg?component'
import Location from '~/assets/icons/location.svg?component'
import LocationStatusIp from '~/assets/icons/locationStatus-ip.svg?component'
import LocationStatusMap from '~/assets/icons/locationStatus-map.svg?component'
import Weather from '~/assets/icons/weather.svg?component'
import Settings from '~/assets/icons/settings.svg?component'
import ConditionLightRain from '~/assets/icons/condition-light-rain.svg?component'
import TimeMorning from '~/assets/icons/time-morning.svg?component'
import TimeAfternoon from '~/assets/icons/time-afternoon.svg?component'
import TimeEvening from '~/assets/icons/time-evening.svg?component'
import TimeNight from '~/assets/icons/time-night.svg?component'
import TimeTomorrow from '~/assets/icons/time-tomorrow.svg?component'

export const icons = {
  cities: Cities,
  location: Location,
  'locationStatus-ip': LocationStatusIp,
  'locationStatus-map': LocationStatusMap,
  weather: Weather,
  settings: Settings,
  'condition-light-rain': ConditionLightRain,
  'time-morning': TimeMorning,
  'time-afternoon': TimeAfternoon,
  'time-evening': TimeEvening,
  'time-night': TimeNight,
  'time-tomorrow': TimeTomorrow,
} as const

export type IconName = keyof typeof icons
