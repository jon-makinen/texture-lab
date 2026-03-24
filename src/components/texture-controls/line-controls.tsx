"use client";

import { LineConfig, LINE_STYLES, LineStyle } from "@/lib/types";
import { LabeledSlider } from "@/components/labeled-slider";

interface LineControlsProps {
  config: LineConfig;
  onChange: (config: LineConfig) => void;
}

export function LineControls({ config, onChange }: LineControlsProps) {
  function update(partial: Partial<LineConfig>) {
    onChange({ ...config, ...partial });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono text-ink-muted w-20 shrink-0 uppercase tracking-wider">
          Style
        </span>
        <div className="flex gap-1">
          {LINE_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => update({ style })}
              className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wide transition-colors border ${
                config.style === style
                  ? "bg-accent-ui/10 border-accent-ui-dim text-ink"
                  : "border-edge text-ink-muted hover:text-ink hover:border-edge-strong"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <LabeledSlider label="Angle" value={config.angle} onChange={(v) => update({ angle: v })} min={0} max={180} step={1} />
        <LabeledSlider label="Thickness" value={config.thickness} onChange={(v) => update({ thickness: v })} />
        <LabeledSlider label="Spacing" value={config.spacing} onChange={(v) => update({ spacing: v })} />
        <LabeledSlider label="Secondary" value={config.secondaryOpacity} onChange={(v) => update({ secondaryOpacity: v })} />
      </div>
    </div>
  );
}
