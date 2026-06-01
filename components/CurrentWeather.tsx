'use client'

import type { CurrentWeather, Location } from '@/lib/weather'
import { getWeatherEmoji, getWeatherDesc } from '@/lib/weather'
import type { TempUnit } from '@/lib/units'
import { formatTemp, formatWind } from '@/lib/units'

interface CurrentWeatherProps {
  location: Location
  weather: CurrentWeather
  unit: TempUnit
  onShare: () => void
  shareFeedback: string | null
}

export default function CurrentWeatherCard({
  location,
  weather,
  unit,
  onShare,
  shareFeedback,
}: CurrentWeatherProps) {
  return (
    <div className="retro-border bg-black p-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-retro-teal pb-2 mb-4">
        <h2 className="text-xl text-retro-yellow">
          Current Weather: {location.name}
        </h2>
        <button type="button" onClick={onShare} className="retro-btn text-xs">
          🔗 Share
        </button>
      </div>

      {shareFeedback && (
        <p className="text-retro-cyan text-xs text-center mb-2">{shareFeedback}</p>
      )}

      <div className="flex flex-col md:flex-row items-center justify-around gap-4">
        <div className="text-6xl" aria-hidden="true">
          {getWeatherEmoji(weather.weatherCode)}
        </div>
        <div className="text-center">
          <p className="text-4xl text-retro-yellow font-bold">
            {formatTemp(weather.temperature, unit)}
          </p>
          <p className="text-retro-pink">{getWeatherDesc(weather.weatherCode)}</p>
        </div>
        <div className="text-sm text-retro-cyan">
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>💨 Wind: {formatWind(weather.windSpeed, unit)}</p>
        </div>
      </div>
    </div>
  )
}
