"use client";

import { NoiseConfig } from "@/lib/types";
import { LabeledSlider } from "@/components/labeled-slider";

interface NoiseControlsProps {
  config: NoiseConfig;
  onChange: (config: NoiseConfig) => void;
}

export function NoiseControls({ config, onChange }: NoiseControlsProps) {
  function update(partial: Partial<NoiseConfig>) {
    onChange({ ...config, ...partial });
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
      <LabeledSlider label="Scale" value={config.scale} onChange={(v) => update({ scale: v })} />
      <LabeledSlider label="Octaves" value={config.octaves} onChange={(v) => update({ octaves: v })} />
      <LabeledSlider label="Intensity" value={config.intensity} onChange={(v) => update({ intensity: v })} />
      <LabeledSlider label="Contrast" value={config.contrast} onChange={(v) => update({ contrast: v })} />
    </div>
  );
}
