
"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type HeroTheme = "cyber" | "editorial";

export type ScreenGlitchHandle = {
  transitionTo: (theme: HeroTheme) => void;
};

type Props = {
  theme: HeroTheme;
  onThemeChange: (theme: HeroTheme) => void;
};

type RGB = readonly [number, number, number];

type Palette = {
  background: RGB;
  bands: readonly RGB[];
  light: RGB;
  cut: RGB;
};

// ========================================
// CONFIGURACIÓN DE TIEMPOS
// ========================================

const FIRST_AUTO_DELAY_MS = 3500;
const MIN_AUTO_DELAY_MS = 15000;
const MAX_AUTO_DELAY_MS = 20000;
const BURST_DURATION_MS = 900;
const FRAME_INTERVAL_MS = 42;

// ========================================
// PALETAS
// ========================================

const PALETTES: Record<HeroTheme, Palette> = {
  cyber: {
    background: [3, 6, 17],
    bands: [
      [53, 217, 255],
      [50, 116, 255],
      [150, 87, 255],
      [204, 120, 255],
    ],
    light: [217, 250, 255],
    cut: [2, 3, 11],
  },

  editorial: {
    background: [245, 241, 233],
    bands: [
      [72, 66, 78],
      [118, 107, 135],
      [175, 165, 185],
      [209, 200, 188],
    ],
    light: [255, 253, 248],
    cut: [211, 203, 196],
  },
};

// ========================================
// UTILIDAD DE COLOR
// ========================================

function mix(a: RGB, b: RGB, t: number) {
  return `rgb(${a
    .map((value, index) =>
      Math.round(value + (b[index] - value) * t),
    )
    .join(",")})`;
}

// ========================================
// COMPONENTE
// ========================================

const ScreenGlitch = forwardRef<
  ScreenGlitchHandle,
  Props
>(function ScreenGlitch(
  { theme, onThemeChange },
  forwardedRef,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [portalTarget, setPortalTarget] =
    useState<HTMLElement | null>(null);

  const themeRef = useRef<HeroTheme>(theme);

  const onThemeChangeRef = useRef(onThemeChange);

  const transitionRef = useRef<
    ((theme: HeroTheme) => void) | null
  >(null);

  // ========================================
  // PORTAL EN BODY
  // ========================================

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  // ========================================
  // SINCRONIZAR ESTADO
  // ========================================

  useEffect(() => {
    themeRef.current = theme;
    onThemeChangeRef.current = onThemeChange;
  }, [theme, onThemeChange]);

  // ========================================
  // CONTROL MANUAL
  // ========================================

  useImperativeHandle(
    forwardedRef,
    () => ({
      transitionTo(nextTheme) {
        transitionRef.current?.(nextTheme);
      },
    }),
    [],
  );

  // ========================================
  // SISTEMA DE GLITCH
  // ========================================

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const heroElement =
      document.getElementById("inicio");

    const context =
      canvasElement?.getContext("2d");

    if (!canvasElement || !heroElement || !context) {
      return;
    }

    // Referencias no nulas y estables.
    // Evitan TS18047 dentro de callbacks.

    const canvas: HTMLCanvasElement = canvasElement;
    const hero: HTMLElement = heroElement;
    const ctx: CanvasRenderingContext2D = context;

    const grainCanvas =
      document.createElement("canvas");

    const grainContext =
      grainCanvas.getContext("2d");

    if (!grainContext) {
      return;
    }

    const grainCtx: CanvasRenderingContext2D =
      grainContext;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let width = 1;
    let height = 1;

    let timerId = 0;
    let frameId = 0;

    let visible = false;
    let firstAutomaticTransition = true;
    let running = false;
    let disposed = false;

    let sourceTheme: HeroTheme =
      themeRef.current;

    let targetTheme: HeroTheme =
      themeRef.current;

    let pendingTheme: HeroTheme | null = null;

    let grainImage =
      grainCtx.createImageData(1, 1);

    let lastProgress = 0;

    // ========================================
    // COMPROBAR SI SE PUEDE ANIMAR
    // ========================================

    const canAnimate = () =>
      !disposed &&
      visible &&
      !document.hidden &&
      !reduceMotion.matches;

    // ========================================
    // CAMBIAR TEMA REAL
    // ========================================

    const commit = (nextTheme: HeroTheme) => {
      if (
        disposed ||
        themeRef.current === nextTheme
      ) {
        return;
      }

      themeRef.current = nextTheme;

      onThemeChangeRef.current(nextTheme);
    };

    // ========================================
    // AJUSTAR CANVAS AL VIEWPORT
    // ========================================

    const resize = () => {
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;

      const scale = Math.min(
        1,
        1600 / Math.max(1, viewWidth),
      );

      width = Math.max(
        1,
        Math.round(viewWidth * scale),
      );

      height = Math.max(
        1,
        Math.round(viewHeight * scale),
      );

      canvas.width = width;
      canvas.height = height;

      grainCanvas.width = Math.max(
        72,
        Math.round(width / 6),
      );

      grainCanvas.height = Math.max(
        54,
        Math.round(height / 6),
      );

      grainImage = grainCtx.createImageData(
        grainCanvas.width,
        grainCanvas.height,
      );
    };

    // ========================================
    // DIBUJAR GLITCH
    // ========================================

    const paint = (progress: number) => {
      lastProgress = progress;

      const from =
        PALETTES[sourceTheme] ?? PALETTES.cyber;

      const to =
        PALETTES[targetTheme] ?? PALETTES.editorial;

      const normalized = Math.min(
        1,
        Math.max(
          0,
          (progress - 0.08) / 0.84,
        ),
      );

      const blend =
        normalized *
        normalized *
        (3 - 2 * normalized);

      const editorialAmount =
        sourceTheme === "editorial"
          ? 1 - blend
          : blend;

      const light = mix(
        from.light,
        to.light,
        blend,
      );

      const bands = from.bands.map(
        (color, index) =>
          mix(
            color,
            to.bands[index] ?? to.bands[0],
            blend,
          ),
      );

      // Fondo opaco

      ctx.globalAlpha = 1;

      ctx.fillStyle = mix(
        from.background,
        to.background,
        blend,
      );

      ctx.fillRect(0, 0, width, height);

      // Ruido digital

      const pixels = grainImage.data;

      for (
        let index = 0;
        index < pixels.length;
        index += 4
      ) {
        const value = Math.random() * 135;

        pixels[index] =
          value * 0.3 * (1 - editorialAmount) +
          (224 + value * 0.18) *
            editorialAmount;

        pixels[index + 1] =
          value * 0.55 * (1 - editorialAmount) +
          (220 + value * 0.18) *
            editorialAmount;

        pixels[index + 2] =
          value * (1 - editorialAmount) +
          (226 + value * 0.16) *
            editorialAmount;

        pixels[index + 3] = 255;
      }

      grainCtx.putImageData(
        grainImage,
        0,
        0,
      );

      ctx.imageSmoothingEnabled = false;

      ctx.globalAlpha = 0.58;

      ctx.drawImage(
        grainCanvas,
        0,
        0,
        width,
        height,
      );

      // Distorsiones horizontales

      for (
        let index = 0;
        index < 7;
        index++
      ) {
        const sourceY = Math.max(
          0,
          Math.floor(
            Math.random() *
              Math.max(
                1,
                grainCanvas.height - 5,
              ),
          ),
        );

        ctx.globalAlpha = 0.72;

        ctx.drawImage(
          grainCanvas,
          0,
          sourceY,
          grainCanvas.width,
          4,
          (Math.random() - 0.5) *
            width *
            0.34,
          Math.random() * height,
          width,
          8 + Math.random() * 32,
        );
      }

      // Bandas RGB

      for (
        let index = 0;
        index < 32;
        index++
      ) {
        const x =
          (Math.random() * 0.98 - 0.12) *
          width;

        const y =
          Math.random() * height;

        const bandWidth =
          width *
          (0.1 + Math.random() * 0.72);

        const bandHeight =
          index % 5 === 0
            ? 7 + Math.random() * 22
            : 1 + Math.random() * 4;

        ctx.globalAlpha =
          0.2 + Math.random() * 0.48;

        ctx.fillStyle =
          bands[
            Math.floor(
              Math.random() * bands.length,
            )
          ];

        ctx.fillRect(
          x,
          y,
          bandWidth,
          bandHeight,
        );

        if (index % 4 === 0) {
          ctx.globalAlpha = 0.62;

          ctx.fillStyle = light;

          ctx.fillRect(
            x + 12,
            y - 1,
            bandWidth * 0.36,
            1,
          );
        }
      }

      // Líneas tipo scanline

      ctx.globalAlpha = 0.2;

      ctx.fillStyle = mix(
        [0, 0, 0],
        [113, 105, 117],
        editorialAmount,
      );

      for (
        let y = 0;
        y < height;
        y += 4
      ) {
        ctx.fillRect(
          0,
          y,
          width,
          1,
        );
      }

      // Corte principal del glitch

      const cutY =
        ((progress + 0.18) % 1) *
        height;

      const cutHeight = Math.max(
        10,
        height * 0.028,
      );

      ctx.globalAlpha = 1;

      ctx.fillStyle = mix(
        from.cut,
        to.cut,
        blend,
      );

      ctx.fillRect(
        0,
        cutY,
        width,
        cutHeight,
      );

      ctx.globalAlpha = 0.82;
      ctx.fillStyle = bands[0];

      ctx.fillRect(
        0,
        cutY,
        width,
        2,
      );

      ctx.globalAlpha = 0.58;
      ctx.fillStyle =
        bands[2] ?? bands[0];

      ctx.fillRect(
        0,
        cutY + cutHeight,
        width,
        2,
      );

      ctx.globalAlpha = 1;
    };

    // ========================================
    // DETENER ANIMACIÓN
    // ========================================

    const stopAnimation = (
      commitTarget = false,
    ) => {
      window.clearTimeout(timerId);
      cancelAnimationFrame(frameId);

      if (commitTarget && running) {
        commit(targetTheme);
      }

      running = false;
      pendingTheme = null;

      canvas.style.visibility = "hidden";
    };

    // ========================================
    // INICIAR GLITCH
    // ========================================

    function startBurst(
      nextTheme: HeroTheme,
    ) {
      if (
        disposed ||
        nextTheme === themeRef.current
      ) {
        return;
      }

      window.clearTimeout(timerId);

      if (running) {
        pendingTheme = nextTheme;
        return;
      }

      if (!canAnimate()) {
        commit(nextTheme);
        return;
      }

      firstAutomaticTransition = false;

      sourceTheme = themeRef.current;
      targetTheme = nextTheme;

      resize();

      running = true;

      paint(0);

      canvas.style.visibility = "visible";

      const startedAt = performance.now();

      let lastPaintAt = startedAt;

      const animate = (now: number) => {
        if (!canAnimate()) {
          stopAnimation(true);
          return;
        }

        const progress = Math.min(
          1,
          (now - startedAt) /
            BURST_DURATION_MS,
        );

        // Cambiar la interfaz cuando
        // el glitch la está ocultando.

        if (progress >= 0.46) {
          commit(targetTheme);
        }

        if (
          now - lastPaintAt >=
          FRAME_INTERVAL_MS
        ) {
          paint(progress);
          lastPaintAt = now;
        }

        if (progress >= 1) {
          running = false;

          canvas.style.visibility =
            "hidden";

          const pending = pendingTheme;
          pendingTheme = null;

          if (
            pending &&
            pending !== themeRef.current
          ) {
            startBurst(pending);
          } else {
            scheduleNextTransition();
          }

          return;
        }

        frameId =
          requestAnimationFrame(animate);
      };

      frameId =
        requestAnimationFrame(animate);
    }

    // ========================================
    // PROGRAMAR SIGUIENTE TRANSICIÓN
    // ========================================

    function scheduleNextTransition() {
      window.clearTimeout(timerId);

      if (!canAnimate() || running) {
        return;
      }

      const delay =
        firstAutomaticTransition
          ? FIRST_AUTO_DELAY_MS
          : MIN_AUTO_DELAY_MS +
            Math.random() *
              (MAX_AUTO_DELAY_MS -
                MIN_AUTO_DELAY_MS);

      timerId = window.setTimeout(() => {
        if (!canAnimate()) {
          return;
        }

        if (hero.matches(":focus-within")) {
          scheduleNextTransition();
          return;
        }

        startBurst(
          themeRef.current === "cyber"
            ? "editorial"
            : "cyber",
        );
      }, delay);
    }

    // ========================================
    // CAMBIO MANUAL
    // ========================================

    transitionRef.current = (nextTheme) => {
      window.clearTimeout(timerId);

      if (
        nextTheme === themeRef.current &&
        !running
      ) {
        scheduleNextTransition();
        return;
      }

      startBurst(nextTheme);

      if (!running) {
        scheduleNextTransition();
      }
    };

    // ========================================
    // DETECTAR VISIBILIDAD DEL HERO
    // ========================================

    const intersectionObserver =
      new IntersectionObserver(
        ([entry]) => {
          visible =
            entry.isIntersecting &&
            entry.intersectionRatio >= 0.08;

          if (!visible) {
            window.clearTimeout(timerId);

            if (running) {
              stopAnimation(true);
            }

            return;
          }

          scheduleNextTransition();
        },
        {
          threshold: [0, 0.08],
        },
      );

    // ========================================
    // VISIBILIDAD DE LA PESTAÑA
    // ========================================

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation(true);
        return;
      }

      scheduleNextTransition();
    };

    // ========================================
    // ACCESIBILIDAD
    // ========================================

    const handleMotionPreferenceChange =
      () => {
        if (reduceMotion.matches) {
          stopAnimation(true);
        } else {
          scheduleNextTransition();
        }
      };

    // ========================================
    // INICIALIZACIÓN
    // ========================================

    resize();

    window.addEventListener(
      "resize",
      resize,
      { passive: true },
    );

    intersectionObserver.observe(hero);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    reduceMotion.addEventListener(
      "change",
      handleMotionPreferenceChange,
    );

    // ========================================
    // LIMPIEZA
    // ========================================

    return () => {
      disposed = true;

      window.clearTimeout(timerId);

      cancelAnimationFrame(frameId);

      transitionRef.current = null;

      intersectionObserver.disconnect();

      window.removeEventListener(
        "resize",
        resize,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      reduceMotion.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
    };
  }, [portalTarget]);

  // ========================================
  // CANVAS SOBRE TODA LA PANTALLA
  // ========================================

  return portalTarget
    ? createPortal(
        <canvas
          ref={canvasRef}
          data-hero-glitch=""
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483647,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            visibility: "hidden",
          }}
        />,
        portalTarget,
      )
    : null;
});

export default ScreenGlitch;
