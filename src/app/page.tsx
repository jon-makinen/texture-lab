"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { TextureCanvas } from "@/components/texture-canvas";
import { ControlBar } from "@/components/control-bar";
import { exportCanvasAsPng } from "@/lib/export";
import {
  GeneratorState,
  TextureType,
  TextureConfig,
  DEFAULT_COLORS,
  DEFAULT_CONFIG,
  PATTERN_SHAPES,
  LINE_STYLES,
  TEXTURE_TYPES,
} from "@/lib/types";

function randomSeed(): number {
  return Math.floor(Math.random() * 2147483647);
}

function randomizeConfig(config: TextureConfig, seed: number): TextureConfig {
  let s = seed;
  function rng() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  }

  return {
    blur: {
      spread: 0.3 + rng() * 0.7,
      radius: 0.2 + rng() * 0.8,
      layers: rng(),
      softness: 0.3 + rng() * 0.7,
    },
    noise: {
      scale: 0.1 + rng() * 0.9,
      octaves: rng(),
      intensity: 0.3 + rng() * 0.7,
      contrast: rng() * 0.8,
    },
    patterns: {
      shape: PATTERN_SHAPES[Math.floor(rng() * PATTERN_SHAPES.length)],
      size: 0.1 + rng() * 0.9,
      spacing: 0.2 + rng() * 0.8,
      rotation: rng(),
      strokeWeight: 0.1 + rng() * 0.6,
      offset: rng(),
    },
    lines: {
      style: LINE_STYLES[Math.floor(rng() * LINE_STYLES.length)],
      angle: rng() * 180,
      thickness: 0.1 + rng() * 0.7,
      spacing: 0.2 + rng() * 0.8,
      secondaryOpacity: rng() * 0.8,
    },
    mesh: {
      softness: 0.3 + rng() * 0.7,
      distortion: rng() * 0.6,
      points: 2 + Math.floor(rng() * 6),
    },
  };
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fill, setFill] = useState(true);
  const [state, setState] = useState<GeneratorState>(() => ({
    type: "blur",
    colors: [...DEFAULT_COLORS],
    config: { ...DEFAULT_CONFIG },
    seed: 0,
    opacity: 1,
    previewBgColor: "#ffffff",
    logoImage: null,
  }));

  useEffect(() => {
    const seed = randomSeed();
    setState((prev) => ({
      ...prev,
      seed,
      config: randomizeConfig(prev.config, seed),
    }));
  }, []);

  const handleTypeChange = useCallback((type: TextureType) => {
    setState((prev) => ({ ...prev, type }));
  }, []);

  const handleColorsChange = useCallback((colors: string[]) => {
    setState((prev) => ({ ...prev, colors }));
  }, []);

  const handleConfigChange = useCallback((config: TextureConfig) => {
    setState((prev) => ({ ...prev, config }));
  }, []);

  const handleOpacityChange = useCallback((opacity: number) => {
    setState((prev) => ({ ...prev, opacity }));
  }, []);

  const handlePreviewBgChange = useCallback((previewBgColor: string) => {
    setState((prev) => ({ ...prev, previewBgColor }));
  }, []);

  const handleSeedChange = useCallback((seed: number) => {
    setState((prev) => ({ ...prev, seed }));
  }, []);

  const handleLogoChange = useCallback((logoImage: HTMLImageElement | null) => {
    setState((prev) => ({ ...prev, logoImage }));
  }, []);

  const handleRandomize = useCallback(() => {
    const newSeed = randomSeed();
    setState((prev) => ({
      ...prev,
      seed: newSeed,
      config: randomizeConfig(prev.config, newSeed),
    }));
  }, []);

  const handleRandomizeWithType = useCallback(() => {
    const newSeed = randomSeed();
    const newType = TEXTURE_TYPES[Math.floor(Math.random() * TEXTURE_TYPES.length)];
    setState((prev) => ({
      ...prev,
      seed: newSeed,
      type: newType,
      config: randomizeConfig(prev.config, newSeed),
    }));
  }, []);

  const handleRandomizeAll = useCallback(() => {
    const newSeed = randomSeed();
    const newType = TEXTURE_TYPES[Math.floor(Math.random() * TEXTURE_TYPES.length)];
    const count = 3 + Math.floor(Math.random() * 3);
    const colors = Array.from({ length: count }, () =>
      "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")
    );
    setState((prev) => ({
      ...prev,
      seed: newSeed,
      type: newType,
      colors,
      config: randomizeConfig(prev.config, newSeed),
    }));
  }, []);

  const handleExport = useCallback(() => {
    if (canvasRef.current) {
      exportCanvasAsPng(
        canvasRef.current,
        state.opacity,
        `texture-${state.type}-${Date.now()}.png`
      );
    }
  }, [state.type, state.opacity]);

  return (
    <div className="h-full flex flex-col bg-white">
      <TextureCanvas state={state} canvasRef={canvasRef} fill={fill} />
      <ControlBar
        state={state}
        fill={fill}
        onFillChange={setFill}
        onTypeChange={handleTypeChange}
        onColorsChange={handleColorsChange}
        onConfigChange={handleConfigChange}
        onOpacityChange={handleOpacityChange}
        onPreviewBgChange={handlePreviewBgChange}
        onSeedChange={handleSeedChange}
        onLogoChange={handleLogoChange}
        onRandomize={handleRandomize}
        onRandomizeWithType={handleRandomizeWithType}
        onRandomizeAll={handleRandomizeAll}
        onExport={handleExport}
      />
    </div>
  );
}
