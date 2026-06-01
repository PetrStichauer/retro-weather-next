'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Location } from '@/lib/weather'
import { searchLocations, locationLabel } from '@/lib/weather'

interface SearchBoxProps {
  query: string
  onQueryChange: (q: string) => void
  onSelect: (loc: Location) => void
  onUseLocation: () => void
  geoLoading: boolean
  recentCities: Location[]
}

export default function SearchBox({
  query,
  onQueryChange,
  onSelect,
  onUseLocation,
  geoLoading,
  recentCities,
}: SearchBoxProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [searching, setSearching] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const listRef = useRef<HTMLUListElement>(null)

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setLocations([])
      return
    }
    setSearching(true)
    try {
      const results = await searchLocations(q)
      setLocations(results)
      setHighlightIndex(results.length > 0 ? 0 : -1)
    } catch {
      setLocations([])
      setHighlightIndex(-1)
    }
    setSearching(false)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300)
    return () => clearTimeout(timer)
  }, [query, doSearch])

  const selectHighlighted = () => {
    if (highlightIndex >= 0 && locations[highlightIndex]) {
      onSelect(locations[highlightIndex])
      setLocations([])
      setHighlightIndex(-1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (locations.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => (i + 1) % locations.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => (i <= 0 ? locations.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectHighlighted()
    } else if (e.key === 'Escape') {
      setLocations([])
      setHighlightIndex(-1)
    }
  }

  return (
    <div className="retro-border bg-black p-4 mb-6 relative">
      <label htmlFor="city-search" className="block text-retro-cyan mb-2 text-sm">
        Enter your location:
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id="city-search"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type city name..."
          className="retro-input flex-1 min-w-[180px]"
          autoComplete="off"
          role="combobox"
          aria-expanded={locations.length > 0}
          aria-controls="location-list"
          aria-activedescendant={
            highlightIndex >= 0 ? `location-option-${highlightIndex}` : undefined
          }
        />
        <button
          type="button"
          onClick={onUseLocation}
          disabled={geoLoading}
          className="retro-btn text-sm whitespace-nowrap"
        >
          {geoLoading ? 'Locating...' : '📍 My Location'}
        </button>
      </div>

      {locations.length > 0 && (
        <ul
          id="location-list"
          ref={listRef}
          role="listbox"
          className="absolute left-0 right-0 mt-1 bg-black border-2 border-retro-pink z-10 max-h-48 overflow-y-auto"
        >
          {locations.map((loc, i) => (
            <li
              key={`${loc.lat}-${loc.lon}`}
              role="option"
              id={`location-option-${i}`}
              aria-selected={i === highlightIndex}
            >
              <button
                type="button"
                onClick={() => {
                  onSelect(loc)
                  setLocations([])
                }}
                className={`w-full text-left px-4 py-2 transition-colors ${
                  i === highlightIndex
                    ? 'bg-retro-pink text-black'
                    : 'text-retro-yellow hover:bg-retro-pink hover:text-black'
                }`}
              >
                {locationLabel(loc)}
              </button>
            </li>
          ))}
        </ul>
      )}

      {searching && (
        <p className="text-retro-teal mt-2 text-sm blink">Searching...</p>
      )}

      {recentCities.length > 0 && locations.length === 0 && query.length < 2 && (
        <div className="mt-3">
          <p className="text-retro-gray text-xs mb-2">Recent cities:</p>
          <div className="flex flex-wrap gap-2">
            {recentCities.map((loc) => (
              <button
                key={`recent-${loc.lat}-${loc.lon}`}
                type="button"
                onClick={() => onSelect(loc)}
                className="retro-btn text-xs py-1 px-2"
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
