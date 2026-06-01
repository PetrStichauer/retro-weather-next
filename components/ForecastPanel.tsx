'use client'

import type { HourlyForecastItem, DailyForecastItem } from '@/lib/weather'
import { getWeatherEmoji, formatTime, formatDay } from '@/lib/weather'
import type { TempUnit } from '@/lib/units'
import { formatTemp } from '@/lib/units'

interface ForecastPanelProps {
  hourly: HourlyForecastItem[]
  daily: DailyForecastItem[]
  unit: TempUnit
}

export default function ForecastPanel({ hourly, daily, unit }: ForecastPanelProps) {
  return (
    <>
      {hourly.length > 0 && (
        <div className="retro-border bg-black p-4 mb-6">
          <h3 className="text-lg text-retro-yellow text-center border-b-2 border-retro-pink pb-2 mb-4">
            5-Hour Forecast
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
            {hourly.map((f) => (
              <div
                key={f.time}
                className="text-center border-2 border-retro-teal p-2 min-w-[72px] flex-shrink-0 md:min-w-0"
              >
                <p className="text-retro-cyan text-xs">{formatTime(f.time)}</p>
                <p className="text-2xl my-1">{getWeatherEmoji(f.weatherCode)}</p>
                <p className="text-retro-yellow font-bold">
                  {formatTemp(f.temperature, unit)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {daily.length > 0 && (
        <div className="retro-border bg-black p-4">
          <h3 className="text-lg text-retro-yellow text-center border-b-2 border-retro-pink pb-2 mb-4">
            7-Day Forecast
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-7 md:overflow-visible">
            {daily.map((d) => (
              <div
                key={d.date}
                className="text-center border-2 border-retro-teal p-2 min-w-[80px] flex-shrink-0 md:min-w-0"
              >
                <p className="text-retro-cyan text-xs">{formatDay(d.date)}</p>
                <p className="text-2xl my-1">{getWeatherEmoji(d.weatherCode)}</p>
                <p className="text-retro-yellow font-bold text-sm">
                  {formatTemp(d.tempMax, unit)}
                </p>
                <p className="text-retro-gray text-xs">
                  {formatTemp(d.tempMin, unit)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
