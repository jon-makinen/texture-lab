"use client";

import { useState, useRef, useCallback } from "react";
import { extractColorsFromImage, loadImageFromFile } from "@/lib/extract-colors";

interface ImageDropProps {
  onColorsExtracted: (colors: string[]) => void;
}

export function ImageDrop({ onColorsExtracted }: ImageDropProps) {
  const [dragging, setDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setExtracting(true);
      try {
        const img = await loadImageFromFile(file);
        const colors = extractColorsFromImage(img, 4);
        onColorsExtracted(colors);
      } catch {
        // silently fail
      } finally {
        setExtracting(false);
      }
    },
    [onColorsExtracted]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <button
      type="button"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`
        h-8 px-3 rounded text-[11px] font-mono uppercase tracking-wider
        border border-dashed transition-colors cursor-pointer
        flex items-center gap-1.5
        ${
          dragging
            ? "border-ink-secondary bg-surface-raised text-ink"
            : "border-edge-strong text-ink-muted hover:text-ink hover:border-ink-muted"
        }
        ${extracting ? "opacity-50 pointer-events-none" : ""}
      `}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M10 7.5v2a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-2M6 2v6M3.5 4.5L6 2l2.5 2.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {extracting ? "..." : "Drop image"}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </button>
  );
}
