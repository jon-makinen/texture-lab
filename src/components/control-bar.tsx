"use client";

import { useState, useRef, useEffect } from "react";
import { TextureType, TEXTURE_TYPES, GeneratorState, TextureConfig } from "@/lib/types";
import { ColorPicker } from "./color-picker";
import { ImageDrop } from "./image-drop";
import { LabeledSlider } from "./labeled-slider";
import { BlurControls } from "./texture-controls/blur-controls";
import { NoiseControls } from "./texture-controls/noise-controls";
import { PatternControls } from "./texture-controls/pattern-controls";
import { LineControls } from "./texture-controls/line-controls";
import { MeshControls } from "./texture-controls/mesh-controls";

const BG_PRESETS = ["#ffffff", "#f5f5f5", "#e4e4e7", "#18181b", "#000000"];

interface ControlBarProps {
  state: GeneratorState;
  fill: boolean;
  onFillChange: (fill: boolean) => void;
  onTypeChange: (type: TextureType) => void;
  onColorsChange: (colors: string[]) => void;
  onConfigChange: (config: TextureConfig) => void;
  onOpacityChange: (opacity: number) => void;
  onPreviewBgChange: (color: string) => void;
  onSeedChange: (seed: number) => void;
  onLogoChange: (logo: HTMLImageElement | null) => void;
  onRandomize: () => void;
  onRandomizeWithType: () => void;
  onRandomizeAll: () => void;
  onExport: () => void;
}

export function ControlBar({
  state,
  fill,
  onFillChange,
  onTypeChange,
  onColorsChange,
  onConfigChange,
  onOpacityChange,
  onPreviewBgChange,
  onSeedChange,
  onLogoChange,
  onRandomize,
  onRandomizeWithType,
  onRandomizeAll,
  onExport,
}: ControlBarProps) {

  function renderControls() {
    switch (state.type) {
      case "blur":
        return (
          <BlurControls
            config={state.config.blur}
            onChange={(blur) => onConfigChange({ ...state.config, blur })}
          />
        );
      case "noise":
        return (
          <NoiseControls
            config={state.config.noise}
            onChange={(noise) => onConfigChange({ ...state.config, noise })}
          />
        );
      case "patterns":
        return (
          <PatternControls
            config={state.config.patterns}
            logoImage={state.logoImage}
            onChange={(patterns) => onConfigChange({ ...state.config, patterns })}
            onLogoChange={onLogoChange}
          />
        );
      case "lines":
        return (
          <LineControls
            config={state.config.lines}
            onChange={(lines) => onConfigChange({ ...state.config, lines })}
          />
        );
      case "mesh":
        return (
          <MeshControls
            config={state.config.mesh}
            onChange={(mesh) => onConfigChange({ ...state.config, mesh })}
          />
        );
    }
  }

  return (
    <div className="shrink-0 bg-surface border-t border-edge px-6 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {TEXTURE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => onTypeChange(t)}
              className={`px-3 py-1.5 rounded text-[12px] font-mono uppercase tracking-wider transition-colors border ${
                state.type === t
                  ? "bg-accent-ui/10 border-accent-ui-dim text-ink"
                  : "border-transparent text-ink-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ImageDrop onColorsExtracted={onColorsChange} />
          <ColorPicker colors={state.colors} onChange={onColorsChange} />
        </div>
      </div>

      <div>{renderControls()}</div>

      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-1 max-w-64">
            <LabeledSlider
              label="Opacity"
              value={state.opacity}
              onChange={onOpacityChange}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
          <BgColorPicker value={state.previewBgColor} onChange={onPreviewBgChange} />
          <FitFillToggle fill={fill} onChange={onFillChange} />
        </div>
        <div className="flex items-center gap-2">
          <SeedInput seed={state.seed} onChange={onSeedChange} />
          <div className="flex items-center">
            <button
              onClick={onRandomize}
              title="Randomize settings"
              className="px-3 py-1.5 rounded-l text-[12px] font-mono uppercase tracking-wider border border-edge text-ink-muted hover:text-ink hover:border-edge-strong transition-colors"
            >
              Tweak
            </button>
            <button
              onClick={onRandomizeWithType}
              title="Randomize settings and type"
              className="px-3 py-1.5 text-[12px] font-mono uppercase tracking-wider border border-l-0 border-edge text-ink-muted hover:text-ink hover:border-edge-strong transition-colors"
            >
              Shuffle
            </button>
            <button
              onClick={onRandomizeAll}
              title="Randomize everything including colors"
              className="px-3 py-1.5 rounded-r text-[12px] font-mono uppercase tracking-wider border border-l-0 border-edge text-ink-muted hover:text-ink hover:border-edge-strong transition-colors"
            >
              Chaos
            </button>
          </div>
          <button
            onClick={onExport}
            className="px-4 py-1.5 rounded text-[12px] font-mono uppercase tracking-wider bg-foreground text-background hover:bg-ink-secondary transition-colors font-medium"
          >
            Export PNG
          </button>
        </div>
      </div>
    </div>
  );
}

function SeedInput({
  seed,
  onChange,
}: {
  seed: number;
  onChange: (seed: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(seed));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editing) setValue(String(seed));
  }, [seed, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function commit(v: string) {
    const parsed = parseInt(v, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    } else {
      setValue(String(seed));
    }
    setEditing(false);
  }

  function rollNewSeed() {
    onChange(Math.floor(Math.random() * 2147483647));
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] font-mono text-ink-muted uppercase tracking-wider">
        Seed
      </span>
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => commit(value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(value);
            if (e.key === "Escape") { setValue(String(seed)); setEditing(false); }
          }}
          className="w-24 h-6 px-1.5 rounded-sm bg-control-bg border border-edge text-ink font-mono text-[11px] tabular-nums focus:outline-none focus:border-ink-muted"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="h-6 px-1.5 rounded-sm border border-edge text-[11px] font-mono text-ink-muted tabular-nums hover:text-ink hover:border-ink-muted transition-colors"
        >
          {seed}
        </button>
      )}
      <button
        onClick={rollNewSeed}
        title="New random seed"
        className="size-6 rounded-sm border border-edge text-ink-muted hover:text-ink hover:border-ink-muted transition-colors flex items-center justify-center"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1" />
          <circle cx="4" cy="4" r="0.8" fill="currentColor" />
          <circle cx="8" cy="4" r="0.8" fill="currentColor" />
          <circle cx="4" cy="8" r="0.8" fill="currentColor" />
          <circle cx="8" cy="8" r="0.8" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}

function BgColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [hex, setHex] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHex(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function commitHex(v: string) {
    const cleaned = v.startsWith("#") ? v : "#" + v;
    if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) {
      onChange(cleaned);
    } else {
      setHex(value);
    }
    setEditing(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-mono text-ink-muted uppercase tracking-wider">
        BG
      </span>
      {BG_PRESETS.map((preset) => (
        <button
          key={preset}
          onClick={() => onChange(preset)}
          className={`size-5 rounded-sm border transition-colors ${
            value === preset ? "border-ink-secondary" : "border-edge hover:border-ink-muted"
          }`}
          style={{ backgroundColor: preset }}
        />
      ))}
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          onBlur={() => commitHex(hex)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitHex(hex);
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-16 h-5 px-1 rounded-sm bg-control-bg border border-edge text-ink font-mono text-[10px] focus:outline-none focus:border-ink-muted"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="h-5 px-1.5 rounded-sm border border-edge text-[10px] font-mono text-ink-muted hover:text-ink hover:border-ink-muted transition-colors"
        >
          {value}
        </button>
      )}
    </div>
  );
}

function FitFillToggle({
  fill,
  onChange,
}: {
  fill: boolean;
  onChange: (fill: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <button
        onClick={() => onChange(false)}
        className={`h-6 px-2 rounded-l-sm text-[11px] font-mono uppercase tracking-wider border transition-colors ${
          !fill
            ? "bg-accent-ui/10 border-accent-ui-dim text-ink"
            : "border-edge text-ink-muted hover:text-ink"
        }`}
      >
        Fit
      </button>
      <button
        onClick={() => onChange(true)}
        className={`h-6 px-2 rounded-r-sm text-[11px] font-mono uppercase tracking-wider border border-l-0 transition-colors ${
          fill
            ? "bg-accent-ui/10 border-accent-ui-dim text-ink"
            : "border-edge text-ink-muted hover:text-ink"
        }`}
      >
        Fill
      </button>
    </div>
  );
}
