"use client";

import { useRef } from "react";
import { PatternConfig, PATTERN_SHAPES } from "@/lib/types";
import { LabeledSlider } from "@/components/labeled-slider";

interface PatternControlsProps {
  config: PatternConfig;
  logoImage: HTMLImageElement | null;
  onChange: (config: PatternConfig) => void;
  onLogoChange: (logo: HTMLImageElement | null) => void;
}

export function PatternControls({ config, logoImage, onChange, onLogoChange }: PatternControlsProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  function update(partial: Partial<PatternConfig>) {
    onChange({ ...config, ...partial });
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => onLogoChange(img);
    img.src = url;
  }

  function clearLogo() {
    onLogoChange(null);
    if (fileRef.current) fileRef.current.value = "";
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
      {config.shape === "logo" && (
        <div className="flex items-center gap-2 pl-22">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1 rounded text-[11px] font-mono uppercase tracking-wider border border-edge text-ink-muted hover:text-ink hover:border-edge-strong transition-colors"
          >
            {logoImage ? "Replace logo" : "Upload logo"}
          </button>
          {logoImage && (
            <>
              <img
                src={logoImage.src}
                alt="Logo preview"
                className="h-6 w-6 object-contain rounded-sm border border-edge"
              />
              <button
                onClick={clearLogo}
                className="px-2 py-1 rounded text-[11px] font-mono uppercase tracking-wider border border-edge text-ink-muted hover:text-ink hover:border-edge-strong transition-colors"
              >
                Clear
              </button>
            </>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <LabeledSlider label="Size" value={config.size} onChange={(v) => update({ size: v })} />
        <LabeledSlider label="Spacing" value={config.spacing} onChange={(v) => update({ spacing: v })} />
        {!config.seamless && (
          <LabeledSlider label="Rotation" value={config.rotation} onChange={(v) => update({ rotation: v })} />
        )}
        <LabeledSlider label="Offset" value={config.offset} onChange={(v) => update({ offset: v })} />
        {config.shape !== "logo" && (
          <LabeledSlider label="Weight" value={config.strokeWeight} onChange={(v) => update({ strokeWeight: v })} />
        )}
        <div className="flex items-center gap-3 col-span-2">
          <button
            onClick={() => update({ seamless: !config.seamless })}
            className={`px-3 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-colors border ${
              config.seamless
                ? "bg-accent-ui/10 border-accent-ui-dim text-ink"
                : "border-edge text-ink-muted hover:text-ink hover:border-edge-strong"
            }`}
          >
            Seamless
          </button>
          <button
            onClick={() => update({ clipEdges: !config.clipEdges })}
            className={`px-3 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-colors border ${
              config.clipEdges
                ? "bg-accent-ui/10 border-accent-ui-dim text-ink"
                : "border-edge text-ink-muted hover:text-ink hover:border-edge-strong"
            }`}
          >
            Clip Edges
          </button>
        </div>
      </div>
    </div>
  );
}
