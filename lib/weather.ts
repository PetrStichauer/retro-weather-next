export interface Location {
  name: string
  lat: number
  lon: number
  country?: string
}

export interface CurrentWeather {
  temperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  time: string
}

export interface HourlyForecastItem {
  temperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  time: string
}

export interface DailyForecastItem {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
}

export interface WeatherBundle {
  current: CurrentWeather
  hourly: HourlyForecastItem[]
  daily: DailyForecastItem[]
}

const WMO_EMOJI: Record<number, string> = {
  0: '☀️',
  1: '⛅',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌧️',
  53: '🌧️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '❄️',
  73: '❄️',
  75: '❄️',
  77: '❄️',
  80: '🌧️',
  81: '🌧️',
  82: '🌧️',
  85: '❄️',
  86: '❄️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
}

const WMO_DESC: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight showers',
  81: 'Moderate showers',
  82: 'Violent showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm w/ hail',
  99: 'Thunderstorm w/ hail',
}

export function getWeatherEmoji(code: number): string {
  if (WMO_EMOJI[code]) return WMO_EMOJI[code]
  if (code >= 1 && code <= 3) return '⛅'
  if (code >= 45 && code <= 48) return '🌫️'
  if (code >= 51 && code <= 67) return '🌧️'
  if (code >= 71 && code <= 77) return '❄️'
  if (code >= 80 && code <= 82) return '🌧️'
  if (code >= 85 && code <= 86) return '❄️'
  if (code >= 95) return '⛈️'
  return '🌤️'
}

export function getWeatherDesc(code: number): string {
  return WMO_DESC[code] ?? 'Unknown'
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (query.length < 2) return []

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  )
  const data = await res.json()

  if (!data.results) return []

  return data.results.map(
    (r: { name: string; latitude: number; longitude: number; country?: string }) => ({
      name: r.name,
      lat: r.latitude,
      lon: r.longitude,
      country: r.country,
    })
  )
}

export async function fetchWeather(loc: Location): Promise<WeatherBundle> {
  const params = new URLSearchParams({
    latitude: String(loc.lat),
    longitude: String(loc.lon),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '7',
  })

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`)
  if (!res.ok) throw new Error('Weather API request failed')

  const data = await res.json()

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    time: data.current.time,
  }

  const now = new Date()
  const hourly: HourlyForecastItem[] = []

  for (let i = 0; i < data.hourly.time.length; i++) {
    const hourTime = new Date(data.hourly.time[i])
    if (hourTime >= now && hourly.length < 5) {
      hourly.push({
        temperature: data.hourly.temperature_2m[i],
        humidity: data.hourly.relative_humidity_2m[i],
        windSpeed: data.hourly.wind_speed_10m[i],
        weatherCode: data.hourly.weather_code[i],
        time: data.hourly.time[i],
      })
    }
  }

  const daily: DailyForecastItem[] = data.daily.time.map(
    (date: string, i: number) => ({
      date,
      weatherCode: data.daily.weather_code[i],
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
    })
  )

  return { current, hourly, daily }
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  })
}

export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function locationLabel(loc: Location): string {
  return loc.country ? `${loc.name}, ${loc.country}` : loc.name
}

export function buildShareUrl(loc: Location): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams({
    lat: String(loc.lat),
    lon: String(loc.lon),
    name: loc.name,
  })
  if (loc.country) params.set('country', loc.country)
  return `${window.location.origin}?${params.toString()}`
}

export function parseLocationFromUrl(searchParams: URLSearchParams): Location | null {
  const lat = parseFloat(searchParams.get('lat') ?? '')
  const lon = parseFloat(searchParams.get('lon') ?? '')
  const name = searchParams.get('name')

  if (Number.isNaN(lat) || Number.isNaN(lon) || !name) return null

  return {
    name,
    lat,
    lon,
    country: searchParams.get('country') ?? undefined,
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<Location> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en&format=json`
  )
  const data = await res.json()

  if (data.results?.[0]) {
    const r = data.results[0]
    return {
      name: r.name,
      lat: r.latitude,
      lon: r.longitude,
      country: r.country,
    }
  }

  return {
    name: `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
    lat,
    lon,
  }
}
