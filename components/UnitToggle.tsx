'use client'

import type { TempUnit } from '@/lib/units'

interface UnitToggleProps {
  unit: TempUnit
  onChange: (unit: TempUnit) => void
}

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div className="flex gap-1" role="group" aria-label="Temperature unit">
      <button
        type="button"
        onClick={() => onChange('C')}
        className={`retro-btn text-xs py-1 px-3 ${unit === 'C' ? 'bg-retro-cyan text-black' : ''}`}
        aria-pressed={unit === 'C'}
      >
        °C
      </button>
      <button
        type="button"
        onClick={() => onChange('F')}
        className={`retro-btn text-xs py-1 px-3 ${unit === 'F' ? 'bg-retro-cyan text-black' : ''}`}
        aria-pressed={unit === 'F'}
      >
        °F
      </button>
    </div>
  )
}
