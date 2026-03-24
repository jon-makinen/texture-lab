import { LineConfig, CANVAS_WIDTH, CANVAS_HEIGHT } from "../types";

export function drawLines(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  config: LineConfig,
  _seed: number
) {
  const w = CANVAS_WIDTH;
  const h = CANVAS_HEIGHT;

  ctx.clearRect(0, 0, w, h);

  const thickness = 1 + config.thickness * 12;
  const spacing = 6 + config.spacing * 60;
  const angle = config.angle * (Math.PI / 180);
  const primaryColor = colors[0] || "#a1a1aa";
  const secondaryColor = colors[1] || colors[0] || "#63636e";

  const diagonal = Math.sqrt(w * w + h * h);
  const lineCount = Math.ceil(diagonal / spacing) + 10;

  function drawLineSet(a: number, color: string, alpha: number, lineW: number) {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(a);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineW;
    ctx.globalAlpha = alpha;
    ctx.lineCap = "butt";

    for (let i = -lineCount; i <= lineCount; i++) {
      const offset = i * spacing;
      ctx.beginPath();
      ctx.moveTo(-diagonal, offset);
      ctx.lineTo(diagonal, offset);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawLineSet(angle, primaryColor, 1, thickness);

  if (config.style === "crosshatch") {
    drawLineSet(angle + Math.PI / 2, secondaryColor, 0.3 + config.secondaryOpacity * 0.7, thickness * 0.7);
  } else if (config.style === "diagonal") {
    drawLineSet(angle + Math.PI / 4, secondaryColor, 0.2 + config.secondaryOpacity * 0.5, thickness * 0.5);
  }

  ctx.globalAlpha = 1;
}
