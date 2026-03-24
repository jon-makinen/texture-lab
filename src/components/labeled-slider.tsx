"use client";

import { Slider } from "@/components/ui/slider";

interface LabeledSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function LabeledSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
}: LabeledSliderProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-[11px] font-mono text-ink-muted w-20 shrink-0 uppercase tracking-wider">
        {label}
      </span>
      <Slider
        value={[value]}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
        className="flex-1"
      />
      <span className="text-[11px] font-mono text-ink-secondary w-8 text-right tabular-nums">
        {value <= 1 && min === 0 && max === 1
          ? Math.round(value * 100)
          : Math.round(value)}
      </span>
    </div>
  );
}
