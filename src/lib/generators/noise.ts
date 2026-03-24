import { NoiseConfig, CANVAS_WIDTH, CANVAS_HEIGHT } from "../types";
import { seededRandom, hexToRgb } from "./utils";

function generatePermutationTable(rng: () => number): Uint8Array {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 256; i++) p[i + 256] = p[i];
  return p;
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function perlin2d(x: number, y: number, perm: Uint8Array): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);

  const u = fade(xf);
  const v = fade(yf);

  const aa = perm[perm[xi] + yi];
  const ab = perm[perm[xi] + yi + 1];
  const ba = perm[perm[xi + 1] + yi];
  const bb = perm[perm[xi + 1] + yi + 1];

  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

function fbm(
  x: number,
  y: number,
  octaves: number,
  perm: Uint8Array
): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += perlin2d(x * frequency, y * frequency, perm) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / maxValue;
}

export function drawNoise(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  config: NoiseConfig,
  seed: number
) {
  const w = CANVAS_WIDTH;
  const h = CANVAS_HEIGHT;
  const rng = seededRandom(seed);
  const perm = generatePermutationTable(rng);

  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  const rgbColors = colors.map(hexToRgb);
  const scale = (config.scale * 8) + 1;
  const octaves = Math.max(1, Math.round(config.octaves * 6) + 1);
  const intensity = config.intensity;
  const contrast = config.contrast * 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let n = fbm(x / (w / scale), y / (h / scale), octaves, perm);

      n = (n + 1) / 2;
      n = Math.pow(n, 1 + contrast);
      n = Math.max(0, Math.min(1, n * (0.5 + intensity)));

      const colorIndex = n * (rgbColors.length - 1);
      const ci = Math.floor(colorIndex);
      const cf = colorIndex - ci;

      const c1 = rgbColors[Math.min(ci, rgbColors.length - 1)];
      const c2 = rgbColors[Math.min(ci + 1, rgbColors.length - 1)];

      const idx = (y * w + x) * 4;
      data[idx] = Math.round(c1[0] + (c2[0] - c1[0]) * cf);
      data[idx + 1] = Math.round(c1[1] + (c2[1] - c1[1]) * cf);
      data[idx + 2] = Math.round(c1[2] + (c2[2] - c1[2]) * cf);
      data[idx + 3] = Math.round(n * 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
