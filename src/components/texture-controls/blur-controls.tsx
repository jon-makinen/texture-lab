"use client";

import { BlurConfig } from "@/lib/types";
import { LabeledSlider } from "@/components/labeled-slider";

interface BlurControlsProps {
  config: BlurConfig;
  onChange: (config: BlurConfig) => void;
}

export function BlurControls({ config, onChange }: BlurControlsProps) {
  function update(partial: Partial<BlurConfig>) {
    onChange({ ...config, ...partial });
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
      <LabeledSlider label="Spread" value={config.spread} onChange={(v) => update({ spread: v })} />
      <LabeledSlider label="Radius" value={config.radius} onChange={(v) => update({ radius: v })} />
      <LabeledSlider label="Layers" value={config.layers} onChange={(v) => update({ layers: v })} />
      <LabeledSlider label="Softness" value={config.softness} onChange={(v) => update({ softness: v })} />
    </div>
  );
}
