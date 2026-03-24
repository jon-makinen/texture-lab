import { MeshConfig, CANVAS_WIDTH, CANVAS_HEIGHT } from "../types";
import { seededRandom } from "./utils";

export function drawMesh(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  config: MeshConfig,
  seed: number
) {
  const w = CANVAS_WIDTH;
  const h = CANVAS_HEIGHT;
  const rng = seededRandom(seed);

  ctx.clearRect(0, 0, w, h);

  const pointCount = Math.max(3, Math.round(config.points * 4) + 2);
  const softness = 0.3 + config.softness * 0.7;
  const distortion = config.distortion;

  interface MeshPoint {
    x: number;
    y: number;
    color: string;
  }

  const points: MeshPoint[] = [];
  for (let i = 0; i < pointCount; i++) {
    const baseX = rng() * w;
    const baseY = rng() * h;
    const dx = (rng() - 0.5) * w * distortion;
    const dy = (rng() - 0.5) * h * distortion;

    points.push({
      x: baseX + dx,
      y: baseY + dy,
      color: colors[i % colors.length],
    });
  }

  const blurRadius = Math.round(100 + softness * 300);
  ctx.filter = `blur(${blurRadius}px)`;

  for (const point of points) {
    const radius = (0.3 + rng() * 0.5) * Math.max(w, h) * 0.5 * softness;

    const gradient = ctx.createRadialGradient(
      point.x,
      point.y,
      0,
      point.x,
      point.y,
      radius
    );

    gradient.addColorStop(0, point.color);
    gradient.addColorStop(0.4, point.color + "cc");
    gradient.addColorStop(0.7, point.color + "66");
    gradient.addColorStop(1, point.color + "00");

    ctx.globalAlpha = 0.7 + rng() * 0.3;
    ctx.fillStyle = gradient;
    ctx.fillRect(
      point.x - radius,
      point.y - radius,
      radius * 2,
      radius * 2
    );
  }

  ctx.filter = "none";
  ctx.globalAlpha = 1;
}
