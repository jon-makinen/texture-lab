"use client";

import { useRef, useEffect, useCallback } from "react";
import { renderTexture } from "@/lib/generators";
import { GeneratorState, CANVAS_WIDTH, CANVAS_HEIGHT } from "@/lib/types";

interface TextureCanvasProps {
  state: GeneratorState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fill: boolean;
}

export function TextureCanvas({ state, canvasRef, fill }: TextureCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderTexture(ctx, state.type, state.colors, state.config, state.seed);
  }, [state, canvasRef]);

  useEffect(() => {
    const id = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(id);
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: state.previewBgColor }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={fill
          ? "w-full h-full object-cover"
          : "max-w-full max-h-full object-contain"
        }
        style={{ opacity: state.opacity }}
      />
    </div>
  );
}
