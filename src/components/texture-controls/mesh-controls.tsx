"use client";

import { MeshConfig } from "@/lib/types";
import { LabeledSlider } from "@/components/labeled-slider";

interface MeshControlsProps {
  config: MeshConfig;
  onChange: (config: MeshConfig) => void;
}

export function MeshControls({ config, onChange }: MeshControlsProps) {
  function update(partial: Partial<MeshConfig>) {
    onChange({ ...config, ...partial });
  }

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
      <LabeledSlider label="Softness" value={config.softness} onChange={(v) => update({ softness: v })} />
      <LabeledSlider label="Distort" value={config.distortion} onChange={(v) => update({ distortion: v })} />
      <LabeledSlider label="Points" value={config.points} onChange={(v) => update({ points: v })} min={2} max={8} step={1} />
    </div>
  );
}
