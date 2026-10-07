"use client";

import { useEffect, useRef } from "react";

const FIRST_DELAY_MS = 6000;
const MIN_DELAY_MS = 14000;
const MAX_DELAY_MS = 22000;

// Duración de cada interferencia.
const BURST_DURATION_MS = 600;

const FRAME_INTERVAL_MS = 45;

const COLORS = [
  "#35d9ff",
  "#3274ff",
  "#9657ff",
  "#cc78ff",
];

export default function ScreenGlitch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const hero = canvas.parentElement;

    if (!hero) return;

    const context = canvas.getContext("2d");

    if (!context) return;

    const ctx = context;

    const grainCanvas = document.createElement("canvas");
    const grainContext = grainCanvas.getContext("2d");

    if (!grainContext) return;

    const grainCtx = grainContext;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let width = 1;
    let height = 1;
    let timerId = 0;
    let frameId = 0;
    let disposed = false;
    let visible = false;

    let grainImage = grainCtx.createImageData(1, 1);

    const canAnimate = () =>
      !disposed &&
      visible &&
      !document.hidden &&
      !motionPreference.matches;

    const resize = () => {
      // Usamos las dimensiones del hero.
      const bounds = canvas.getBoundingClientRect();
      const scale = Math.min(
        1,
        1600 / Math.max(1, bounds.width),
      );

      width = Math.max(
        1,
        Math.round(bounds.width * scale),
      );

      height = Math.max(
        1,
        Math.round(bounds.height * scale),
      );

      canvas.width = width;
      canvas.height = height;

      grainCanvas.width = Math.max(
        64,
        Math.round(width / 6),
      );

      grainCanvas.height = Math.max(
        48,
        Math.round(height / 6),
      );

      grainImage = grainCtx.createImageData(
        grainCanvas.width,
        grainCanvas.height,
      );
    };

    const paint = (progress: number) => {
      // Fondo opaco contenido dentro del hero.
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#030611";
      ctx.fillRect(0, 0, width, height);

      // Ruido digital azul.
      const pixels = grainImage.data;

      for (
        let index = 0;
        index < pixels.length;
        index += 4
      ) {
        const value = Math.random() * 135;

        pixels[index] = value * 0.3;
        pixels[index + 1] = value * 0.55;
        pixels[index + 2] = value;
        pixels[index + 3] = 255;
      }

      grainCtx.putImageData(grainImage, 0, 0);

      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 0.7;

      ctx.drawImage(
        grainCanvas,
        0,
        0,
        width,
        height,
      );

      // Franjas de ruido desplazadas.
      for (let index = 0; index < 6; index++) {
        const sourceY = Math.floor(
          Math.random() * (grainCanvas.height - 4),
        );

        const destinationY = Math.random() * height;

        const offset =
          (Math.random() - 0.5) * width * 0.3;

        ctx.globalAlpha = 0.85;

        ctx.drawImage(
          grainCanvas,
          0,
          sourceY,
          grainCanvas.width,
          4,
          offset,
          destinationY,
          width,
          8 + Math.random() * 28,
        );
      }

      // Fragmentos de señal cyan, azul y violeta.
      for (let index = 0; index < 28; index++) {
        const x =
          (Math.random() * 0.95 - 0.1) * width;

        const y = Math.random() * height;

        const bandWidth =
          width * (0.12 + Math.random() * 0.7);

        const bandHeight =
          index % 5 === 0
            ? 6 + Math.random() * 18
            : 1 + Math.random() * 3;

        ctx.globalAlpha =
          0.2 + Math.random() * 0.45;

        ctx.fillStyle =
          COLORS[
            Math.floor(Math.random() * COLORS.length)
          ];

        ctx.fillRect(
          x,
          y,
          bandWidth,
          bandHeight,
        );

        if (index % 4 === 0) {
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = "#d9faff";

          ctx.fillRect(
            x + 12,
            y - 1,
            bandWidth * 0.35,
            1,
          );
        }
      }

      // Líneas finas de pantalla digital.
      ctx.globalAlpha = 0.32;
      ctx.fillStyle = "#000000";

      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1);
      }

      // Corte horizontal que atraviesa la señal.
      const cutY =
        ((progress + 0.2) % 1) * height;

      const cutHeight = Math.max(
        8,
        height * 0.025,
      );

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#02030b";

      ctx.fillRect(
        0,
        cutY,
        width,
        cutHeight,
      );

      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "#62dfff";
      ctx.fillRect(0, cutY, width, 2);

      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#a770ff";

      ctx.fillRect(
        0,
        cutY + cutHeight,
        width,
        2,
      );

      ctx.globalAlpha = 1;
    };

    const stop = () => {
      window.clearTimeout(timerId);
      cancelAnimationFrame(frameId);

      timerId = 0;
      frameId = 0;

      canvas.style.visibility = "hidden";
    };

    const schedule = (delay: number) => {
      window.clearTimeout(timerId);

      if (!canAnimate()) return;

      timerId = window.setTimeout(
        startBurst,
        delay,
      );
    };

    const startBurst = () => {
      if (!canAnimate()) return;

      resize();
      paint(0);

      canvas.style.visibility = "visible";

      const startedAt = performance.now();
      let lastPaint = startedAt;

      const animate = (now: number) => {
        if (!canAnimate()) {
          stop();
          return;
        }

        const elapsed = now - startedAt;

        if (elapsed >= BURST_DURATION_MS) {
          stop();

          const nextDelay =
            MIN_DELAY_MS +
            Math.random() *
              (MAX_DELAY_MS - MIN_DELAY_MS);

          schedule(nextDelay);
          return;
        }

        if (
          now - lastPaint >= FRAME_INTERVAL_MS
        ) {
          paint(elapsed / BURST_DURATION_MS);
          lastPaint = now;
        }

        frameId =
          requestAnimationFrame(animate);
      };

      frameId = requestAnimationFrame(animate);
    };

    const restart = () => {
      stop();
      schedule(FIRST_DELAY_MS);
    };

    // El efecto se activa mientras el hero está visible.
    const intersectionObserver =
      new IntersectionObserver(([entry]) => {
        const nextVisible = entry.isIntersecting;

        if (visible === nextVisible) return;

        visible = nextVisible;
        restart();
      });

    intersectionObserver.observe(hero);

    document.addEventListener(
      "visibilitychange",
      restart,
    );

    motionPreference.addEventListener(
      "change",
      restart,
    );

    return () => {
      disposed = true;
      stop();

      intersectionObserver.disconnect();

      document.removeEventListener(
        "visibilitychange",
        restart,
      );

      motionPreference.removeEventListener(
        "change",
        restart,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        visibility: "hidden",
      }}
    />
  );
}