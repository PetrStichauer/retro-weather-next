export type TempUnit = 'C' | 'F'

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32
}

export function convertTemp(celsius: number, unit: TempUnit): number {
  return unit === 'F' ? celsiusToFahrenheit(celsius) : celsius
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  return `${Math.round(convertTemp(celsius, unit))}°${unit}`
}

export function formatWind(kmh: number, unit: TempUnit): string {
  if (unit === 'F') {
    const mph = kmh * 0.621371
    return `${Math.round(mph)} mph`
  }
  return `${Math.round(kmh)} km/h`
}

export function tempUnitLabel(unit: TempUnit): string {
  return unit === 'F' ? '°F' : '°C'
}
