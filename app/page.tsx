'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SearchBox from '@/components/SearchBox'
import CurrentWeatherCard from '@/components/CurrentWeather'
import ForecastPanel from '@/components/ForecastPanel'
import UnitToggle from '@/components/UnitToggle'
import type { Location, WeatherBundle } from '@/lib/weather'
import {
  fetchWeather,
  buildShareUrl,
  parseLocationFromUrl,
  reverseGeocode,
} from '@/lib/weather'
import type { TempUnit } from '@/lib/units'
import {
  getUnitPreference,
  setUnitPreference,
  getRecentCities,
  addRecentCity,
} from '@/lib/storage'

function MarqueeTicker() {
  const text =
    'NO API KEY REQUIRED • POWERED BY OPEN-METEO • EST. 1995 • DIAL UP THE WEATHER • '
  return (
    <div className="overflow-hidden border-2 border-retro-teal bg-black mb-6 py-1">
      <div className="marquee-track whitespace-nowrap text-retro-pink text-xs uppercase">
        <span>{text.repeat(3)}</span>
      </div>
    </div>
  )
}

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [weatherBundle, setWeatherBundle] = useState<WeatherBundle | null>(null)
  const [loading, setLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unit, setUnit] = useState<TempUnit>('C')
  const [recentCities, setRecentCities] = useState<Location[]>([])
  const [shareFeedback, setShareFeedback] = useState<string | null>(null)
  const [urlHandled, setUrlHandled] = useState(false)

  useEffect(() => {
    setUnit(getUnitPreference())
    setRecentCities(getRecentCities())
  }, [])

  const loadWeather = useCallback(
    async (loc: Location, updateUrl = true) => {
      setLoading(true)
      setError(null)
      setSelectedLocation(loc)
      setQuery(loc.name)
      setShareFeedback(null)

      try {
        const data = await fetchWeather(loc)
        setWeatherBundle(data)
        const updated = addRecentCity(loc)
        setRecentCities(updated)

        if (updateUrl) {
          const params = new URLSearchParams({
            lat: String(loc.lat),
            lon: String(loc.lon),
            name: loc.name,
          })
          if (loc.country) params.set('country', loc.country)
          router.replace(`?${params.toString()}`, { scroll: false })
        }
      } catch {
        setError('Failed to fetch weather data. Please try again.')
        setWeatherBundle(null)
      }
      setLoading(false)
    },
    [router]
  )

  useEffect(() => {
    if (urlHandled) return
    const loc = parseLocationFromUrl(searchParams)
    if (loc) {
      setUrlHandled(true)
      loadWeather(loc, false)
    } else {
      setUrlHandled(true)
    }
  }, [searchParams, urlHandled, loadWeather])

  const handleUnitChange = (newUnit: TempUnit) => {
    setUnit(newUnit)
    setUnitPreference(newUnit)
  }

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setGeoLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude)
          setGeoLoading(false)
          loadWeather(loc)
        } catch {
          setGeoLoading(false)
          setError('Failed to get location. Please try again.')
        }
      },
      () => {
        setGeoLoading(false)
        setError('Could not get your location. Please search for a city instead.')
      },
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }

  const handleShare = async () => {
    if (!selectedLocation) return
    const url = buildShareUrl(selectedLocation)

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Weather in ${selectedLocation.name}`,
          url,
        })
        setShareFeedback('Shared!')
      } else {
        await navigator.clipboard.writeText(url)
        setShareFeedback('Link copied to clipboard!')
      }
    } catch {
      setShareFeedback('Could not share — try copying the URL from the address bar.')
    }

    setTimeout(() => setShareFeedback(null), 3000)
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="retro-border bg-black p-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex-1" />
            <h1 className="text-2xl md:text-4xl text-retro-yellow font-bold text-center blink flex-1">
              RetroWeather 3000
            </h1>
            <div className="flex-1 flex justify-end">
              <UnitToggle unit={unit} onChange={handleUnitChange} />
            </div>
          </div>
          <p className="text-center text-retro-pink mt-2 text-sm">
            *** WELCOME TO THE WEATHER ZONE ***
          </p>
        </header>

        <MarqueeTicker />

        <SearchBox
          query={query}
          onQueryChange={setQuery}
          onSelect={loadWeather}
          onUseLocation={handleUseLocation}
          geoLoading={geoLoading}
          recentCities={recentCities}
        />

        {error && (
          <div className="retro-border bg-black p-4 mb-6 border-retro-pink">
            <p className="text-retro-pink text-center font-bold blink">
              ERROR: {error}
            </p>
          </div>
        )}

        {loading && (
          <div className="retro-border bg-black p-8 text-center">
            <p className="text-retro-cyan text-xl blink">LOADING WEATHER DATA...</p>
            <p className="text-retro-pink mt-2 text-sm">
              Please wait while we dial up the satellite...
            </p>
          </div>
        )}

        {!loading && weatherBundle && selectedLocation && (
          <>
            <CurrentWeatherCard
              location={selectedLocation}
              weather={weatherBundle.current}
              unit={unit}
              onShare={handleShare}
              shareFeedback={shareFeedback}
            />
            <ForecastPanel
              hourly={weatherBundle.hourly}
              daily={weatherBundle.daily}
              unit={unit}
            />
          </>
        )}

        {!loading && !weatherBundle && !error && (
          <div className="retro-border bg-black p-8 text-center">
            <p className="text-retro-teal">
              👆 Enter a city or use your location to check the weather!
            </p>
            <p className="text-retro-gray text-sm mt-4">
              Powered by Open-Meteo API | No API key needed
            </p>
          </div>
        )}

        <footer className="mt-8 text-center text-retro-darkGray text-xs">
          <p className="blink">*** END OF TRANSMISSION ***</p>
          <p className="mt-2">&copy; 1995-2026 RetroWeather Inc.</p>
        </footer>
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen p-8 text-center text-retro-cyan blink">
          LOADING...
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
