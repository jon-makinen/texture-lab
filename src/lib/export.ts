import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./types";

export function exportCanvasAsPng(
  sourceCanvas: HTMLCanvasElement,
  opacity: number,
  filename?: string
) {
  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = CANVAS_WIDTH;
  exportCanvas.height = CANVAS_HEIGHT;
  const ctx = exportCanvas.getContext("2d")!;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.globalAlpha = opacity;
  ctx.drawImage(sourceCanvas, 0, 0);
  ctx.globalAlpha = 1;

  exportCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `texture-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}
