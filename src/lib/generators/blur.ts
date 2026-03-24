import { BlurConfig, CANVAS_WIDTH, CANVAS_HEIGHT } from "../types";
import { seededRandom } from "./utils";

export function drawBlur(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  config: BlurConfig,
  seed: number
) {
  const w = CANVAS_WIDTH;
  const h = CANVAS_HEIGHT;
  const rng = seededRandom(seed);

  ctx.clearRect(0, 0, w, h);

  const layerCount = Math.max(2, Math.round(config.layers * 3) + 2);
  const blurAmount = Math.round(config.radius * 250) + 50;
  const spread = config.spread;

  ctx.filter = `blur(${blurAmount}px)`;

  for (let i = 0; i < layerCount; i++) {
    const color = colors[i % colors.length];
    const cx = rng() * w * spread + w * (1 - spread) / 2;
    const cy = rng() * h * spread + h * (1 - spread) / 2;
    const rx = (rng() * 0.4 + 0.2) * w * (config.softness * 0.8 + 0.4);
    const ry = (rng() * 0.4 + 0.2) * h * (config.softness * 0.8 + 0.4);

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, color + "aa");
    gradient.addColorStop(1, color + "00");

    ctx.globalAlpha = 0.6 + rng() * 0.4;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rng() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.filter = "none";
  ctx.globalAlpha = 1;
}
