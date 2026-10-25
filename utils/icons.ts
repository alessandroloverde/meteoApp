import Cities from '~/assets/icons/cities.svg?component'
import Location from '~/assets/icons/location.svg?component'
import LocationStatusIp from '~/assets/icons/locationStatus-ip.svg?component'
import LocationStatusMap from '~/assets/icons/locationStatus-map.svg?component'
import Weather from '~/assets/icons/weather.svg?component'
import Settings from '~/assets/icons/settings.svg?component'
import ConditionClear from '~/assets/icons/condition-clear.svg?component'
import ConditionCloudy from '~/assets/icons/condition-cloudy.svg?component'
import ConditionDrizzle from '~/assets/icons/condition-drizzle.svg?component'
import ConditionFog from '~/assets/icons/condition-fog.svg?component'
import ConditionHeavyRain from '~/assets/icons/condition-heavyRain.svg?component'
import ConditionPartlyCloudy from '~/assets/icons/condition-partlyCloudy.svg?component'
import ConditionRain from '~/assets/icons/condition-rain.svg?component'
import ConditionSnow from '~/assets/icons/condition-snow.svg?component'
import ConditionStorm from '~/assets/icons/condition-storm.svg?component'
import TimeMorning from '~/assets/icons/time-morning.svg?component'
import TimeAfternoon from '~/assets/icons/time-afternoon.svg?component'
import TimeEvening from '~/assets/icons/time-evening.svg?component'
import TimeNight from '~/assets/icons/time-night.svg?component'
import TimeToday from '~/assets/icons/time-today.svg?component'
import TimeTomorrow from '~/assets/icons/time-tomorrow.svg?component'

export const icons = {
  cities: Cities,
  location: Location,
  'locationStatus-ip': LocationStatusIp,
  'locationStatus-map': LocationStatusMap,
  weather: Weather,
  settings: Settings,
  'condition-clear': ConditionClear,
  'condition-cloudy': ConditionCloudy,
  'condition-drizzle': ConditionDrizzle,
  'condition-fog': ConditionFog,
  'condition-heavyRain': ConditionHeavyRain,
  'condition-partlyCloudy': ConditionPartlyCloudy,
  'condition-rain': ConditionRain,
  'condition-snow': ConditionSnow,
  'condition-storm': ConditionStorm,
  'time-morning': TimeMorning,
  'time-afternoon': TimeAfternoon,
  'time-evening': TimeEvening,
  'time-night': TimeNight,
  'time-today': TimeToday,
  'time-tomorrow': TimeTomorrow,
} as const

export type IconName = keyof typeof icons
