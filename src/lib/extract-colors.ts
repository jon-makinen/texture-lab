function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.round(c).toString(16).padStart(2, "0"))
      .join("")
  );
}

function colorDistance(a: number[], b: number[]): number {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
  );
}

export function extractColorsFromImage(
  img: HTMLImageElement,
  count: number = 4
): string[] {
  const canvas = document.createElement("canvas");
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const imageData = ctx.getImageData(0, 0, size, size);
  const pixels: number[][] = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];
    if (a < 128) continue;
    pixels.push([r, g, b]);
  }

  if (pixels.length === 0) return ["#333333", "#666666", "#999999", "#cccccc"];

  // k-means clustering
  let centroids: number[][] = [];
  const step = Math.max(1, Math.floor(pixels.length / count));
  for (let i = 0; i < count; i++) {
    centroids.push([...pixels[Math.min(i * step, pixels.length - 1)]]);
  }

  for (let iter = 0; iter < 20; iter++) {
    const clusters: number[][][] = Array.from({ length: count }, () => []);

    for (const px of pixels) {
      let minDist = Infinity;
      let closest = 0;
      for (let c = 0; c < centroids.length; c++) {
        const d = colorDistance(px, centroids[c]);
        if (d < minDist) {
          minDist = d;
          closest = c;
        }
      }
      clusters[closest].push(px);
    }

    let converged = true;
    for (let c = 0; c < count; c++) {
      if (clusters[c].length === 0) continue;
      const avg = [0, 0, 0];
      for (const px of clusters[c]) {
        avg[0] += px[0];
        avg[1] += px[1];
        avg[2] += px[2];
      }
      const newCentroid = [
        avg[0] / clusters[c].length,
        avg[1] / clusters[c].length,
        avg[2] / clusters[c].length,
      ];
      if (colorDistance(newCentroid, centroids[c]) > 2) converged = false;
      centroids[c] = newCentroid;
    }

    if (converged) break;
  }

  // sort by luminance (dark to light)
  centroids.sort(
    (a, b) =>
      a[0] * 0.299 + a[1] * 0.587 + a[2] * 0.114 -
      (b[0] * 0.299 + b[1] * 0.587 + b[2] * 0.114)
  );

  return centroids.map((c) => rgbToHex(c[0], c[1], c[2]));
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}
