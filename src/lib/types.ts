export const TEXTURE_TYPES = ["blur", "noise", "patterns", "lines", "mesh"] as const;
export type TextureType = (typeof TEXTURE_TYPES)[number];

export const PATTERN_SHAPES = [
  "dots", "circles", "diamonds", "triangles", "hexagons",
  "stars", "crosses", "chevrons", "waves", "grid",
  "dashes", "zigzag", "arrows", "scales",
] as const;
export type PatternShape = (typeof PATTERN_SHAPES)[number];

export const LINE_STYLES = ["parallel", "crosshatch", "diagonal"] as const;
export type LineStyle = (typeof LINE_STYLES)[number];

export interface BlurConfig {
  spread: number;
  radius: number;
  layers: number;
  softness: number;
}

export interface NoiseConfig {
  scale: number;
  octaves: number;
  intensity: number;
  contrast: number;
}

export interface PatternConfig {
  shape: PatternShape;
  size: number;
  spacing: number;
  rotation: number;
  strokeWeight: number;
}

export interface LineConfig {
  style: LineStyle;
  angle: number;
  thickness: number;
  spacing: number;
  secondaryOpacity: number;
}

export interface MeshConfig {
  softness: number;
  distortion: number;
  points: number;
}

export type TextureConfig = {
  blur: BlurConfig;
  noise: NoiseConfig;
  patterns: PatternConfig;
  lines: LineConfig;
  mesh: MeshConfig;
};

export interface GeneratorState {
  type: TextureType;
  colors: string[];
  config: TextureConfig;
  seed: number;
  opacity: number;
  previewBgColor: string;
}

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;

export const DEFAULT_COLORS = ["#ff6b35", "#1e2761", "#7b2d8e", "#f0c27f"];

export const DEFAULT_CONFIG: TextureConfig = {
  blur: { spread: 0.6, radius: 0.5, layers: 0.5, softness: 0.7 },
  noise: { scale: 0.4, octaves: 0.5, intensity: 0.6, contrast: 0.5 },
  patterns: { shape: "dots", size: 0.3, spacing: 0.4, rotation: 0, strokeWeight: 0.3 },
  lines: { style: "parallel", angle: 45, thickness: 0.3, spacing: 0.4, secondaryOpacity: 0 },
  mesh: { softness: 0.6, distortion: 0.3, points: 4 },
};
