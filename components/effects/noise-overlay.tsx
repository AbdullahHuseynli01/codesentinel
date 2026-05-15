"use client";

import { useEffect, useRef } from "react";

const TILE_SIZE = 200;

export function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    const targetCanvas = canvas;
    const targetContext = context;

    const tile = document.createElement("canvas");
    tile.width = TILE_SIZE;
    tile.height = TILE_SIZE;
    const tileContext = tile.getContext("2d");

    if (!tileContext) return;

    let frame = 0;
    let timerId = 0;

    function resize() {
      const ratio = window.devicePixelRatio || 1;
      targetCanvas.width = Math.floor(window.innerWidth * ratio);
      targetCanvas.height = Math.floor(window.innerHeight * ratio);
      targetCanvas.style.width = `${window.innerWidth}px`;
      targetCanvas.style.height = `${window.innerHeight}px`;
      targetContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function paintNoise() {
      const imageData = tileContext.createImageData(TILE_SIZE, TILE_SIZE);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const value = Math.random() * 255;
        pixels[i] = value;
        pixels[i + 1] = value;
        pixels[i + 2] = value;
        pixels[i + 3] = 42;
      }

      tileContext.putImageData(imageData, 0, 0);
      const pattern = targetContext.createPattern(tile, "repeat");

      if (!pattern) return;

      targetContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      targetContext.fillStyle = pattern;
      targetContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    function tick() {
      frame += 1;
      if (frame % 3 === 0) paintNoise();
      timerId = window.setTimeout(tick, 100);
    }

    resize();
    paintNoise();
    tick();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.clearTimeout(timerId);
    };
  }, []);

  return <canvas ref={canvasRef} className="noise-canvas" aria-hidden="true" />;
}
