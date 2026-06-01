import type { Location } from './weather'
import type { TempUnit } from './units'

const RECENT_KEY = 'retro-weather-recent'
const UNIT_KEY = 'retro-weather-unit'
const MAX_RECENT = 5

export function getUnitPreference(): TempUnit {
  if (typeof window === 'undefined') return 'C'
  const stored = localStorage.getItem(UNIT_KEY)
  return stored === 'F' ? 'F' : 'C'
}

export function setUnitPreference(unit: TempUnit): void {
  localStorage.setItem(UNIT_KEY, unit)
}

export function getRecentCities(): Location[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Location[]
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : []
  } catch {
    return []
  }
}

export function addRecentCity(loc: Location): Location[] {
  const existing = getRecentCities().filter(
    (c) => !(c.lat === loc.lat && c.lon === loc.lon)
  )
  const updated = [loc, ...existing].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  return updated
}
