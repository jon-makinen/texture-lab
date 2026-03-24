"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  className?: string
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
  disabled?: boolean
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled,
}: SliderProps) {
  const current = value?.[0] ?? defaultValue?.[0] ?? min
  const pct = ((current - min) / (max - min)) * 100

  return (
    <div
      data-slot="slider"
      className={cn("relative flex w-full touch-none items-center select-none h-5", className)}
    >
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={(e) => onValueChange?.(parseFloat(e.target.value))}
        className="slider-input absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
      />
      <div
        data-slot="slider-track"
        className="relative h-1 w-full rounded-full bg-muted overflow-hidden"
      >
        <div
          data-slot="slider-range"
          className="absolute h-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div
        data-slot="slider-thumb"
        className="absolute size-3 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] pointer-events-none"
        style={{ left: `calc(${pct}% - 6px)` }}
      />
    </div>
  )
}

export { Slider }
