"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./HeroSphere.module.css";
import type { HeroTheme } from "./ScreenGlitch";
type Point = {
  x: number;
  y: number;
  z: number;
  scale: number;
};
type Orbit = {
  radius: number;
  tilt: number;
  rotation: number;
  speed: number;
  phase: number;
  color: string;
};
// Segundos que tarda el conjunto en dar una vuelta completa.
const TURN_SECONDS = 26;
const FPS = 30;
const EDITORIAL_ORBITS = ["#94869e", "#b7aca0", "#66616e"];
const ORBITS: Orbit[] = [
  {
    radius: 1.36,
    tilt: 1.08,
    rotation: -0.48,
    speed: 0.42,
    phase: 0.4,
    color: "#65baff",
  },
  {
    radius: 1.4,
    tilt: 1.13,
    rotation: 0.5,
    speed: -0.32,
    phase: 2.7,
    color: "#b68aff",
  },
  {
    radius: 1.27,
    tilt: 0.85,
    rotation: -1.08,
    speed: 0.27,
    phase: 4.3,
    color: "#7d9fff",
  },
];
function drawOrbit(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  orbit: Orbit,
  front: boolean,
  unit: number,
  editorial: boolean,
) {
  ctx.save();
  ctx.beginPath();
  let drawing = false;
  for (let index = 1; index < points.length; index++) {
    const previous = points[index - 1];
    const current = points[index];
    const isFront = (previous.z + current.z) / 2 >= 0;
    if (isFront !== front) {
      drawing = false;
      continue;
    }
    if (!drawing) {
      ctx.moveTo(previous.x, previous.y);
      drawing = true;
    }
    ctx.lineTo(current.x, current.y);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = orbit.color;
  ctx.globalAlpha = front ? 0.95 : 0.36;
  ctx.lineWidth = (front ? (editorial ? 2.3 : 2.8) : 1.7) * unit;
  ctx.shadowColor = orbit.color;
  ctx.shadowBlur = editorial ? 0 : (front ? 14 : 6) * unit;
  ctx.stroke();
  if (front) {
    ctx.globalAlpha = 0.72;
    ctx.lineWidth = 0.85 * unit;
    ctx.strokeStyle = editorial ? "#fffaf2" : "#e6f6ff";
    ctx.shadowBlur = editorial ? 0 : 3 * unit;
    ctx.stroke();
  }
  ctx.restore();
}
function drawSatellite(
  ctx: CanvasRenderingContext2D,
  point: Point,
  orbit: Orbit,
  unit: number,
  editorial: boolean,
) {
  const radius = 11 * unit * point.scale;
  const gradient = ctx.createRadialGradient(
    point.x - radius * 0.35,
    point.y - radius * 0.45,
    radius * 0.04,
    point.x,
    point.y,
    radius,
  );
  gradient.addColorStop(0, editorial ? "#fffef8" : "#effaff");
  gradient.addColorStop(0.13, editorial ? "#ece7dd" : "#84caff");
  gradient.addColorStop(0.32, editorial ? "#c2b8c8" : "#143d8b");
  gradient.addColorStop(0.7, editorial ? "#877c89" : "#020817");
  gradient.addColorStop(0.9, editorial ? "#dad2c7" : "#18275f");
  gradient.addColorStop(1, orbit.color);
  ctx.save();
  ctx.globalAlpha = point.z >= 0 ? 1 : 0.72;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.shadowColor = orbit.color;
  ctx.shadowBlur = (editorial ? 2 : 12) * unit;
  ctx.fill();
  ctx.strokeStyle = editorial ? "#f8f1e7" : "#a7d6ff";
  ctx.lineWidth = 1.2 * unit;
  ctx.stroke();
  ctx.restore();
}
function drawFlare(
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  angle: number,
  color: string,
  intensity: number,
  unit: number,
) {
  const x = center + Math.cos(angle) * radius;
  const y = center + Math.sin(angle) * radius;
  const flareRadius = 19 * unit * intensity;
  const gradient = ctx.createRadialGradient(
    x,
    y,
    0,
    x,
    y,
    flareRadius,
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.12, "#e7f5ff");
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, flareRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#e9f8ff";
  ctx.lineWidth = 0.85 * unit;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8 * unit;
  ctx.beginPath();
  ctx.moveTo(x - flareRadius * 0.85, y);
  ctx.lineTo(x + flareRadius * 0.85, y);
  ctx.moveTo(x, y - flareRadius * 0.6);
  ctx.lineTo(x, y + flareRadius * 0.6);
  ctx.stroke();
  ctx.restore();
}
// Material nacarado: solo se dibuja en el estilo editorial.
function drawPearlBody(
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
) {
  const pearl = ctx.createRadialGradient(
    center - radius * 0.42, center - radius * 0.48, radius * 0.05,
    center + radius * 0.13, center + radius * 0.13, radius * 1.2,
  );
  pearl.addColorStop(0, "#fffdf6");
  pearl.addColorStop(0.28, "#f7f3e9");
  pearl.addColorStop(0.58, "#e7dfd3");
  pearl.addColorStop(0.8, "#c6bacd");
  pearl.addColorStop(1, "#a89f99");
  ctx.save();
  ctx.fillStyle = pearl;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fill();
  const sheen = ctx.createRadialGradient(
    center - radius * 0.38, center - radius * 0.4, 0,
    center - radius * 0.38, center - radius * 0.4, radius * 0.72,
  );
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.64)");
  sheen.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sheen;
  ctx.fill();
  ctx.restore();
}

function drawEditorialEdge(
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  unit: number,
) {
  const edge = ctx.createLinearGradient(center - radius, center - radius, center + radius, center + radius);
  edge.addColorStop(0, "#fffdf6");
  edge.addColorStop(0.35, "#c7c0b4");
  edge.addColorStop(0.7, "#9e90ad");
  edge.addColorStop(1, "#f6eee2");
  ctx.save();
  ctx.strokeStyle = edge;
  ctx.lineWidth = 1.8 * unit;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSphereEdge(
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  time: number,
  unit: number,
  editorial: boolean,
) {
  if (editorial) {
    drawEditorialEdge(ctx, center, radius, unit);
    return;
  }
  const angle = time * 0.18;
  const dx = Math.cos(angle) * radius;
  const dy = Math.sin(angle) * radius;
  const gradient = ctx.createLinearGradient(
    center - dx,
    center - dy,
    center + dx,
    center + dy,
  );
  gradient.addColorStop(0, "#b7f0ff");
  gradient.addColorStop(0.24, "#2274ff");
  gradient.addColorStop(0.48, "#bce8ff");
  gradient.addColorStop(0.72, "#955bff");
  gradient.addColorStop(1, "#49caff");
  ctx.save();
  ctx.strokeStyle = gradient;
  ctx.shadowColor = "#278dff";
  ctx.shadowBlur = 17 * unit;
  ctx.lineWidth = 3.8 * unit;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.stroke();
  for (const offset of [-5, 4]) {
    ctx.beginPath();
    ctx.arc(
      center,
      center,
      radius + offset * unit,
      0,
      Math.PI * 2,
    );
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.1 * unit;
    ctx.shadowBlur = 6 * unit;
    ctx.stroke();
  }
  for (let index = 0; index < 5; index++) {
    const start = time * 0.2 + index * 1.26;
    ctx.beginPath();
    ctx.arc(
      center,
      center,
      radius + Math.sin(time * 0.35 + index) * 2.4 * unit,
      start,
      start + 0.38 + (index % 2) * 0.24,
    );
    ctx.strokeStyle = index % 2 === 0 ? "#d9f8ff" : "#a88cff";
    ctx.globalAlpha = 0.88;
    ctx.lineWidth = (index % 2 === 0 ? 2.6 : 1.8) * unit;
    ctx.shadowBlur = 11 * unit;
    ctx.stroke();
  }
  ctx.restore();
  drawFlare(
    ctx,
    center,
    radius,
    -0.78 + time * 0.13,
    "#9879ff",
    0.95 + Math.sin(time * 0.7) * 0.08,
    unit,
  );
  drawFlare(
    ctx,
    center,
    radius,
    2.4 + time * 0.13,
    "#38acff",
    0.65,
    unit,
  );
}
export default function HeroSphere({ theme = "cyber" }: { theme?: HeroTheme }) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);
  const repaintRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    repaintRef.current?.();
  }, [theme]);

  useEffect(() => {
    const backCanvas = backRef.current;
    const frontCanvas = frontRef.current;
    const art = artRef.current;
    const rotor = rotorRef.current;
    if (!backCanvas || !frontCanvas || !art || !rotor) return;
    const backContext = backCanvas.getContext("2d");
    const frontContext = frontCanvas.getContext("2d");
    if (!backContext || !frontContext) return;
    const back = backContext;
    const front = frontContext;
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let size = 1;
    let time = 0;
    let frameId = 0;
    let visible = true;
    let previousTime = performance.now();
    let accumulatedTime = 0;
    const render = () => {
      const editorial = themeRef.current === "editorial";
      const t = motionPreference.matches ? 0 : time;
      const movement = editorial ? 0.45 : 1;
      const center = size / 2;
      const radius = size * 0.31;
      const unit = size / 600;
      const perspective = size * 2.8;
      // Giro completo, inclinación y balanceo del conjunto.
      const yaw = (t / TURN_SECONDS) * Math.PI * 2;
      const pitch = Math.sin(t * 0.4) * 0.42;
      const roll = Math.sin(t * 0.27) * 0.15;
      const cx = Math.cos(pitch);
      const sx = Math.sin(pitch);
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cz = Math.cos(roll);
      const sz = Math.sin(roll);
      back.clearRect(0, 0, size, size);
      front.clearRect(0, 0, size, size);
      art.style.setProperty(
        "--float-x",
        `${Math.sin(t * 0.35) * 5 * movement}px`,
      );
      art.style.setProperty(
        "--float-y",
        `${Math.sin(t * 0.8) * 9 * movement}px`,
      );
      art.style.setProperty(
        "--sphere-scale",
        `${1 + Math.sin(t * 0.45) * 0.02 * movement}`,
      );
      // El logo usa la misma orientación que los aros.
      rotor.style.transform = `
        perspective(${perspective}px)
        rotateZ(${roll}rad)
        rotateY(${yaw}rad)
        rotateX(${pitch}rad)
      `;
      const project = (
        angle: number,
        orbit: Orbit,
      ): Point => {
        const orbitRadius = radius * orbit.radius;
        const x = Math.cos(angle) * orbitRadius;
        const baseY = Math.sin(angle) * orbitRadius;
        const y = baseY * Math.cos(orbit.tilt);
        const z = baseY * Math.sin(orbit.tilt);
        // Orientación propia de cada aro.
        const localX =
          x * Math.cos(orbit.rotation) -
          y * Math.sin(orbit.rotation);
        const localY =
          x * Math.sin(orbit.rotation) +
          y * Math.cos(orbit.rotation);
        // Rotación global en X.
        const tiltedY = localY * cx - z * sx;
        const tiltedZ = localY * sx + z * cx;
        // Rotación global en Y.
        const turnedX = localX * cy + tiltedZ * sy;
        const turnedZ = -localX * sy + tiltedZ * cy;
        // Rotación global en Z.
        const finalX = turnedX * cz - tiltedY * sz;
        const finalY = turnedX * sz + tiltedY * cz;
        const scale = perspective / (perspective - turnedZ);
        return {
          x: center + finalX * scale,
          y: center + finalY * scale,
          z: turnedZ,
          scale,
        };
      };
      const orbitData = ORBITS.map((baseOrbit, orbitIndex) => {
        const orbit = {
          ...baseOrbit,
          color: editorial ? EDITORIAL_ORBITS[orbitIndex] : baseOrbit.color,
        };
        return {
          orbit,
          points: Array.from({ length: 129 }, (_, index) =>
            project((index / 128) * Math.PI * 2, orbit),
          ),
          satellite: project(t * orbit.speed + orbit.phase, orbit),
        };
      });
      // Capa que pasa por detrás del logo.
      for (const item of orbitData) {
        drawOrbit(back, item.points, item.orbit, false, unit, editorial);
        if (item.satellite.z < 0) {
          drawSatellite(back, item.satellite, item.orbit, unit, editorial);
        }
      }
      // El centro cyber permanece transparente. Editorial añade el nácar detrás del logo.
      if (editorial) drawPearlBody(back, center, radius);
      drawSphereEdge(front, center, radius, t, unit, editorial);
      // Capa que pasa por delante del logo.
      for (const item of orbitData) {
        drawOrbit(front, item.points, item.orbit, true, unit, editorial);
        if (item.satellite.z >= 0) {
          drawSatellite(front, item.satellite, item.orbit, unit, editorial);
        }
      }
    };
    repaintRef.current = render;
    const resize = () => {
      size = Math.max(1, art.clientWidth);
      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2,
      );
      for (const canvas of [backCanvas, frontCanvas]) {
        canvas.width = Math.round(size * pixelRatio);
        canvas.height = Math.round(size * pixelRatio);
      }
      back.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      front.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      render();
    };
    const canAnimate = () =>
      visible &&
      !document.hidden &&
      !motionPreference.matches;
    const animate = (now: number) => {
      if (!canAnimate()) return;
      const delta = Math.min(
        (now - previousTime) / 1000,
        0.08,
      );
      previousTime = now;
      time += delta;
      accumulatedTime += delta;
      if (accumulatedTime >= 1 / FPS) {
        accumulatedTime %= 1 / FPS;
        render();
      }
      frameId = requestAnimationFrame(animate);
    };
    const restart = () => {
      cancelAnimationFrame(frameId);
      previousTime = performance.now();
      accumulatedTime = 0;
      render();
      if (canAnimate()) {
        frameId = requestAnimationFrame(animate);
      }
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(art);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        restart();
      },
      { threshold: 0.01 },
    );
    intersectionObserver.observe(art);
    document.addEventListener("visibilitychange", restart);
    motionPreference.addEventListener("change", restart);
    restart();
    return () => {
      repaintRef.current = null;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", restart);
      motionPreference.removeEventListener("change", restart);
    };
  }, []);
  return (
    <div className={styles.wrapper} data-theme={theme} aria-hidden="true">
      <div ref={artRef} className={styles.art}>
        <canvas
          ref={backRef}
          className={`${styles.canvas} ${styles.backCanvas}`}
        />
        <div className={styles.logo}>
          <div ref={rotorRef} className={styles.rotor}>
            {[0, 1].map((side) => (
              <div
                key={side}
                className={`${styles.face} ${
                  side === 1 ? styles.reverse : ""
                }`}
              >
                <Image
                  src="/images/logomientras.png"
                  alt=""
                  fill
                  loading="eager"
                  sizes="(min-width: 1024px) 320px, 250px"
                  className={styles.logoImage}
                />
              </div>
            ))}
          </div>
        </div>
        <canvas
          ref={frontRef}
          className={`${styles.canvas} ${styles.frontCanvas}`}
        />
      </div>
    </div>
  );
}
