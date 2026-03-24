"use client";

import { useState, useRef, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const PRESET_SWATCHES = [
  "#4a6fa5", "#c48a5a", "#2d4a3e", "#8b5e83",
  "#c44a4a", "#4a8fa5", "#e8c47a", "#5a5a8b",
  "#2e2e2e", "#f5f0eb", "#7a4a2d", "#3d6b5e",
  "#d4a574", "#6b4a7a", "#4a7a6b", "#a5704a",
];

interface ColorPickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
}

export function ColorPicker({ colors, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {colors.map((color, i) => (
        <ColorSwatch
          key={i}
          color={color}
          onColorChange={(c) => {
            const next = [...colors];
            next[i] = c;
            onChange(next);
          }}
          onRemove={
            colors.length > 2
              ? () => onChange(colors.filter((_, j) => j !== i))
              : undefined
          }
        />
      ))}
      {colors.length < 6 && (
        <button
          onClick={() => {
            const next = PRESET_SWATCHES.find((s) => !colors.includes(s)) || "#888888";
            onChange([...colors, next]);
          }}
          className="size-8 rounded-md border border-edge-strong flex items-center justify-center text-ink-muted hover:text-ink hover:border-edge-strong transition-colors font-mono text-sm"
        >
          +
        </button>
      )}
    </div>
  );
}

function ColorSwatch({
  color,
  onColorChange,
  onRemove,
}: {
  color: string;
  onColorChange: (color: string) => void;
  onRemove?: () => void;
}) {
  const [hex, setHex] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHex(color);
  }, [color]);

  function commitHex(value: string) {
    const cleaned = value.startsWith("#") ? value : "#" + value;
    if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) {
      onColorChange(cleaned);
    } else {
      setHex(color);
    }
  }

  return (
    <Popover>
      <div className="group relative">
        <PopoverTrigger
          className="size-8 rounded-md border border-edge-strong hover:border-ink-muted transition-colors cursor-pointer"
          style={{ backgroundColor: color }}
        />
        {onRemove && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-surface-raised border border-edge-strong text-ink-muted text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:text-ink cursor-pointer z-10"
          >
            x
          </span>
        )}
      </div>
      <PopoverContent
        className="w-56 p-3 bg-surface-raised border-edge-strong"
        side="top"
        sideOffset={8}
      >
        <div className="space-y-3">
          <input
            ref={inputRef}
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            onBlur={() => commitHex(hex)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitHex(hex);
            }}
            className="w-full h-8 px-2 rounded-md bg-control-bg border border-edge text-ink font-mono text-xs focus:outline-none focus:border-ink-muted"
          />
          <div className="grid grid-cols-8 gap-1">
            {PRESET_SWATCHES.map((swatch) => (
              <button
                key={swatch}
                onClick={() => onColorChange(swatch)}
                className="size-5 rounded-sm border border-edge hover:border-ink-muted transition-colors"
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
