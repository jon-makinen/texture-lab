import { TextureType, TextureConfig } from "../types";
import { drawBlur } from "./blur";
import { drawNoise } from "./noise";
import { drawPatterns } from "./patterns";
import { drawLines } from "./lines";
import { drawMesh } from "./mesh";

export function renderTexture(
  ctx: CanvasRenderingContext2D,
  type: TextureType,
  colors: string[],
  config: TextureConfig,
  seed: number
) {
  switch (type) {
    case "blur":
      drawBlur(ctx, colors, config.blur, seed);
      break;
    case "noise":
      drawNoise(ctx, colors, config.noise, seed);
      break;
    case "patterns":
      drawPatterns(ctx, colors, config.patterns, seed);
      break;
    case "lines":
      drawLines(ctx, colors, config.lines, seed);
      break;
    case "mesh":
      drawMesh(ctx, colors, config.mesh, seed);
      break;
  }
}
