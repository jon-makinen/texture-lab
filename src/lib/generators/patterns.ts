import { PatternConfig, CANVAS_WIDTH, CANVAS_HEIGHT } from "../types";

export function drawPatterns(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  config: PatternConfig,
  _seed: number,
  logoImage?: HTMLImageElement | null
) {
  const w = CANVAS_WIDTH;
  const h = CANVAS_HEIGHT;

  ctx.clearRect(0, 0, w, h);

  const baseSize = 8 + config.size * 60;
  const gap = baseSize * (0.5 + config.spacing * 2);
  const cellSize = baseSize + gap;
  const rotation = config.rotation * Math.PI * 2;
  const strokeW = 1 + config.strokeWeight * 6;

  ctx.save();
  ctx.translate(w / 2, h / 2);
  ctx.rotate(rotation);
  ctx.translate(-w / 2, -h / 2);

  const padding = Math.max(w, h);
  const startX = -padding;
  const startY = -padding;
  const endX = w + padding;
  const endY = h + padding;

  const offset = config.offset ?? 0;
  const brickAmount = Math.min(offset * 2, 1);
  const jitterAmount = Math.max((offset - 0.5) * 2, 0);

  let jitterSeed = _seed;
  function jitterRng() {
    jitterSeed = (jitterSeed * 1664525 + 1013904223) & 0xffffffff;
    return ((jitterSeed >>> 0) / 0xffffffff - 0.5) * 2;
  }

  let colorIdx = 0;
  let rowIdx = 0;

  for (let y = startY; y < endY; y += cellSize) {
    const rowShift = rowIdx % 2 === 1 ? cellSize * 0.5 * brickAmount : 0;
    rowIdx++;

    for (let x = startX; x < endX; x += cellSize) {
      const color = colors[colorIdx % colors.length] || "#a1a1aa";
      colorIdx++;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = strokeW;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const jitterX = jitterAmount * jitterRng() * cellSize * 0.4;
      const jitterY = jitterAmount * jitterRng() * cellSize * 0.4;
      const cx = x + cellSize / 2 + rowShift + jitterX;
      const cy = y + cellSize / 2 + jitterY;
      const s = baseSize / 2;

      switch (config.shape) {
        case "dots":
          ctx.beginPath();
          ctx.arc(cx, cy, s, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "circles":
          ctx.beginPath();
          ctx.arc(cx, cy, s, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case "diamonds":
          ctx.beginPath();
          ctx.moveTo(cx, cy - s);
          ctx.lineTo(cx + s, cy);
          ctx.lineTo(cx, cy + s);
          ctx.lineTo(cx - s, cy);
          ctx.closePath();
          ctx.stroke();
          break;

        case "triangles":
          ctx.beginPath();
          ctx.moveTo(cx, cy - s);
          ctx.lineTo(cx + s * 0.87, cy + s * 0.5);
          ctx.lineTo(cx - s * 0.87, cy + s * 0.5);
          ctx.closePath();
          ctx.stroke();
          break;

        case "hexagons": {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const hx = cx + s * Math.cos(angle);
            const hy = cy + s * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
          break;
        }

        case "stars": {
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const angle = (Math.PI / 5) * i - Math.PI / 2;
            const r = i % 2 === 0 ? s : s * 0.4;
            const sx = cx + r * Math.cos(angle);
            const sy = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
          ctx.stroke();
          break;
        }

        case "crosses":
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.6, cy);
          ctx.lineTo(cx + s * 0.6, cy);
          ctx.moveTo(cx, cy - s * 0.6);
          ctx.lineTo(cx, cy + s * 0.6);
          ctx.stroke();
          break;

        case "chevrons":
          ctx.beginPath();
          ctx.moveTo(cx - s, cy + s * 0.3);
          ctx.lineTo(cx, cy - s * 0.3);
          ctx.lineTo(cx + s, cy + s * 0.3);
          ctx.stroke();
          break;

        case "waves": {
          const amp = baseSize * 0.3;
          ctx.beginPath();
          ctx.moveTo(x, cy);
          for (let wx = 0; wx <= cellSize; wx += 2) {
            ctx.lineTo(x + wx, cy + Math.sin((wx / cellSize) * Math.PI * 2) * amp);
          }
          ctx.stroke();
          break;
        }

        case "grid":
          ctx.beginPath();
          ctx.strokeRect(cx - s, cy - s, baseSize, baseSize);
          break;

        case "dashes":
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.7, cy);
          ctx.lineTo(cx + s * 0.7, cy);
          ctx.stroke();
          break;

        case "zigzag": {
          const segs = 4;
          const segW = baseSize / segs;
          const amp = s * 0.6;
          ctx.beginPath();
          ctx.moveTo(cx - s, cy);
          for (let i = 0; i <= segs; i++) {
            ctx.lineTo(
              cx - s + i * segW,
              cy + (i % 2 === 0 ? -amp : amp)
            );
          }
          ctx.stroke();
          break;
        }

        case "arrows": {
          const shaft = s * 0.7;
          const head = s * 0.4;
          ctx.beginPath();
          ctx.moveTo(cx, cy + shaft);
          ctx.lineTo(cx, cy - shaft);
          ctx.moveTo(cx - head, cy - shaft + head);
          ctx.lineTo(cx, cy - shaft);
          ctx.lineTo(cx + head, cy - shaft + head);
          ctx.stroke();
          break;
        }

        case "scales": {
          ctx.beginPath();
          ctx.arc(cx, cy + s * 0.3, s * 0.8, Math.PI, 0);
          ctx.stroke();
          break;
        }

        case "logo": {
          if (logoImage) {
            const aspect = logoImage.naturalWidth / logoImage.naturalHeight;
            let drawW: number, drawH: number;
            if (aspect > 1) {
              drawW = baseSize;
              drawH = baseSize / aspect;
            } else {
              drawH = baseSize;
              drawW = baseSize * aspect;
            }
            ctx.globalAlpha = 1;
            ctx.drawImage(logoImage, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
          }
          break;
        }
      }
    }
  }

  ctx.restore();
}
