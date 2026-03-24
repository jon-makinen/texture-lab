"use client";

import { PatternConfig, PATTERN_SHAPES } from "@/lib/types";
import { LabeledSlider } from "@/components/labeled-slider";

interface PatternControlsProps {
  config: PatternConfig;
  onChange: (config: PatternConfig) => void;
}

export function PatternControls({ config, onChange }: PatternControlsProps) {
  function update(partial: Partial<PatternConfig>) {
    onChange({ ...config, ...partial });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-[11px] font-mono text-ink-muted w-20 shrink-0 uppercase tracking-wider pt-1">
          Shape
        </span>
        <div className="flex flex-wrap gap-1">
          {PATTERN_SHAPES.map((shape) => (
            <button
              key={shape}
              onClick={() => update({ shape })}
              className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-wide transition-colors border ${
                config.shape === shape
                  ? "bg-accent-ui/10 border-accent-ui-dim text-ink"
                  : "border-edge text-ink-muted hover:text-ink hover:border-edge-strong"
              }`}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <LabeledSlider label="Size" value={config.size} onChange={(v) => update({ size: v })} />
        <LabeledSlider label="Spacing" value={config.spacing} onChange={(v) => update({ spacing: v })} />
        <LabeledSlider label="Rotation" value={config.rotation} onChange={(v) => update({ rotation: v })} />
        <LabeledSlider label="Weight" value={config.strokeWeight} onChange={(v) => update({ strokeWeight: v })} />
      </div>
    </div>
  );
}
