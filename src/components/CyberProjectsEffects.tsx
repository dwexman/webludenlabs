"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import s from "./CyberProjectsStage.module.css";

type Vec = [number, number, number];
type Point = [number, number];

type Props = {
  anchorRef: RefObject<HTMLDivElement | null>;
  bridgeRef: RefObject<HTMLDivElement | null>;
};

const TAU = Math.PI * 2;
const RAD = Math.PI / 180;
const SIZE = 640;
const CENTER = SIZE / 2;
const RADIUS = 242;

// Siluetas simplificadas y relieve procedural.
// No requiere imágenes externas.
const LAND: Point[][] = [
  [
    [-168, 70], [-145, 72], [-126, 61], [-111, 69],
    [-90, 73], [-60, 53], [-54, 47], [-68, 44],
    [-80, 26], [-97, 16], [-108, 24], [-118, 33],
    [-126, 51], [-152, 57],
  ],
  [
    [-97, 20], [-86, 21], [-83, 12],
    [-76, 8], [-79, 7], [-88, 15],
  ],
  [
    [-80, 10], [-66, 11], [-51, 4], [-35, -7],
    [-43, -23], [-52, -33], [-66, -55],
    [-75, -49], [-72, -29], [-81, -5],
  ],
  [
    [-55, 60], [-44, 59], [-20, 72],
    [-28, 83], [-49, 82], [-61, 72],
  ],
  [
    [-17, 36], [10, 37], [32, 31], [43, 12],
    [51, 11], [42, -4], [35, -22], [19, -35],
    [11, -18], [8, 3], [-8, 5], [-17, 16],
  ],
  [
    [-10, 36], [-10, 44], [0, 49], [9, 55],
    [5, 62], [20, 71], [31, 70], [30, 58],
    [45, 52], [38, 40], [27, 36], [15, 42], [4, 43],
  ],
  [
    [30, 70], [65, 76], [105, 77], [142, 68],
    [179, 65], [165, 54], [143, 48], [132, 34],
    [121, 22], [108, 7], [98, 12], [89, 22],
    [79, 7], [70, 23], [58, 26], [47, 12],
    [35, 30], [42, 44], [30, 55],
  ],
  [
    [112, -12], [132, -10], [144, -14], [154, -28],
    [146, -39], [129, -34], [114, -35],
  ],
  [[47, -13], [51, -16], [47, -26], [44, -23]],
  [[130, 31], [141, 46], [145, 43], [140, 34]],
  [[-8, 50], [-3, 59], [1, 53]],
  [
    [96, 5], [104, -5], [119, -9],
    [129, -5], [119, 1], [109, 4],
  ],
  [[166, -34], [178, -38], [172, -46], [166, -45]],
];

const CITIES: Point[] = [
  [-70.7, -33.4],
  [-74, 40.7],
  [-46.6, -23.5],
  [-0.1, 51.5],
  [2.3, 48.9],
  [31.2, 30],
  [55.3, 25.2],
  [103.8, 1.3],
  [139.7, 35.7],
  [151.2, -33.9],
];

const ROUTES = [
  [0, 1],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 6],
  [6, 7],
  [7, 8],
  [8, 9],
];

function sphere(
  lon: number,
  lat: number,
  radius = 1
): Vec {
  const a = lon * RAD;
  const b = lat * RAD;

  return [
    Math.cos(b) * Math.sin(a) * radius,
    -Math.sin(b) * radius,
    Math.cos(b) * Math.cos(a) * radius,
  ];
}

function isLand(lon: number, lat: number) {
  return LAND.some((polygon) => {
    let inside = false;

    for (
      let i = 0, j = polygon.length - 1;
      i < polygon.length;
      j = i++
    ) {
      const [x, y] = polygon[i];
      const [px, py] = polygon[j];

      if (
        (y > lat) !== (py > lat) &&
        lon < ((px - x) * (lat - y)) / (py - y) + x
      ) {
        inside = !inside;
      }
    }

    return inside;
  });
}

function noise(x: number, y: number) {
  function hash(a: number, b: number) {
    let n =
      Math.imul(a, 374761393) +
      Math.imul(b, 668265263);

    n = Math.imul(n ^ (n >>> 13), 1274126177);

    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  const ix = Math.floor(x);
  const iy = Math.floor(y);

  let fx = x - ix;
  let fy = y - iy;

  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);

  return (
    (hash(ix, iy) * (1 - fx) + hash(ix + 1, iy) * fx) *
      (1 - fy) +
    (hash(ix, iy + 1) * (1 - fx) +
      hash(ix + 1, iy + 1) * fx) *
      fy
  );
}

function createSurface() {
  const width = 768;
  const height = 384;
  const size = 420;
  const count = width * height;

  const elevation = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const bumpX = new Float32Array(count);
  const bumpY = new Float32Array(count);

  // La textura y el relieve se calculan una sola vez.
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;

      const n =
        noise(x * 0.037, y * 0.037) * 0.5 +
        noise(x * 0.11, y * 0.11) * 0.32 +
        noise(x * 0.31, y * 0.31) * 0.18;

      const coast =
        (noise(x * 0.08, y * 0.08) - 0.5) * 2;

      const land = isLand(
        (x / width) * 360 - 180 + coast,
        90 - (y / height) * 180 + coast * 0.6
      );

      elevation[i] = land ? 0.012 + n * 0.038 : 0;

      colors[i * 3] = land ? 25 + n * 40 : 3;
      colors[i * 3 + 1] = land ? 48 + n * 65 : 12;
      colors[i * 3 + 2] = land
        ? 125 + n * 110
        : 34 + n * 9;
    }
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;

      if (!elevation[i]) continue;

      const left =
        elevation[y * width + ((x + width - 1) % width)] ||
        elevation[i];

      const right =
        elevation[y * width + ((x + 1) % width)] ||
        elevation[i];

      const above = elevation[i - width] || elevation[i];
      const below = elevation[i + width] || elevation[i];

      bumpX[i] = ((right - left) * width) / TAU;
      bumpY[i] = ((below - above) * height) / Math.PI;
    }
  }

  const surface = document.createElement("canvas");
  surface.width = size;
  surface.height = size;

  const context = surface.getContext("2d");
  if (!context) return null;

  const pixels = context.createImageData(size, size);

  const rays: {
    i: number;
    u: number;
    row: number;
    light: number;
    east: number;
    south: number;
    rim: number;
    shine: number;
  }[] = [];

  const tilt = -0.17;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);

  // Proyección esférica y dirección de la luz.
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x + 0.5 - size / 2) / (size / 2);
      const ny = (y + 0.5 - size / 2) / (size / 2);
      const rr = nx * nx + ny * ny;

      if (rr >= 1) continue;

      const z = Math.sqrt(1 - rr);
      const rx = nx * ct + ny * st;
      const ry = -nx * st + ny * ct;

      const lon = Math.atan2(rx, z);
      const lat = Math.asin(-ry);

      const a = Math.sin(lat);
      const b = Math.cos(lat);
      const sl = Math.sin(lon);
      const cl = Math.cos(lon);

      const east =
        (-0.48 * cl * ct - 0.56 * cl * st - 0.66 * sl) /
        Math.max(0.15, b);

      const sx = a * sl;
      const sy = b;
      const sz = a * cl;

      const south =
        -0.48 * (sx * ct - sy * st) -
        0.56 * (sx * st + sy * ct) +
        0.66 * sz;

      const i = (y * size + x) * 4;

      pixels.data[i + 3] = Math.round(
        Math.min(1, (1 - rr) * size * 0.65) * 255
      );

      rays.push({
        i,
        u: Math.floor((lon / TAU + 0.5) * width),
        row:
          Math.min(
            height - 1,
            Math.floor((0.5 - lat / Math.PI) * height)
          ) * width,
        light: -0.48 * nx - 0.56 * ny + 0.66 * z,
        east,
        south,
        rim:
          Math.pow(1 - z, 3.5) *
          Math.max(0.08, -nx * 0.5 - ny * 0.6 + 0.35),
        shine: Math.pow(
          Math.max(0, -nx * 0.25 - ny * 0.32 + z * 0.91),
          28
        ),
      });
    }
  }

  const rimColor = [26, 88, 210];
  const shineColor = [3, 9, 21];

  return {
    surface,

    render(yaw: number) {
      const offset = (yaw / TAU) * width;
      const shift = Math.floor(offset);
      const blend = offset - shift;

      for (const p of rays) {
        const x = ((p.u - shift) % width + width) % width;

        const a = p.row + x;
        const b = p.row + ((x + width - 1) % width);

        const dx =
          bumpX[a] * (1 - blend) + bumpX[b] * blend;

        const dy =
          bumpY[a] * (1 - blend) + bumpY[b] * blend;

        const light = Math.max(
          0,
          (p.light - dx * p.east - dy * p.south) /
            Math.sqrt(1 + dx * dx + dy * dy)
        );

        const shade = 0.09 + light * 0.96;

        for (let c = 0; c < 3; c++) {
          const color =
            colors[a * 3 + c] * (1 - blend) +
            colors[b * 3 + c] * blend;

          pixels.data[p.i + c] = Math.min(
            255,
            color * shade +
              p.rim * rimColor[c] +
              p.shine * shineColor[c]
          );
        }
      }

      context.putImageData(pixels, 0, 0);
    },
  };
}

function DigitalWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let surface: ReturnType<typeof createSurface> = null;

    const cities = CITIES.map(([lon, lat]) =>
      sphere(lon, lat, 1.014)
    );

    const grid: Vec[][] = [];

    for (let lon = -180; lon < 180; lon += 20) {
      grid.push(
        Array.from({ length: 65 }, (_, i) =>
          sphere(lon, -88 + (i * 176) / 64)
        )
      );
    }

    for (let lat = -60; lat <= 60; lat += 20) {
      grid.push(
        Array.from({ length: 121 }, (_, i) =>
          sphere(-180 + i * 3, lat)
        )
      );
    }

    const routes = ROUTES.map(([a, b]) => {
      const start = sphere(...CITIES[a]);
      const end = sphere(...CITIES[b]);

      return Array.from({ length: 49 }, (_, i): Vec => {
        const f = i / 48;

        const v = start.map(
          (n, k) => n * (1 - f) + end[k] * f
        );

        const length = Math.hypot(...v);
        const height = 1.018 + Math.sin(f * Math.PI) * 0.18;

        return v.map((n) => (n / length) * height) as Vec;
      });
    });

    const motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let frame = 0;
    let elapsed = 0;
    let previous = 0;
    let visible = false;
    let disposed = false;
    let scale = 1;

    function draw(time: number) {
      if (!ctx || !canvas) return;

      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);

      const yaw = -0.28 + ((time * 0.072) % TAU);
      const cos = Math.cos(yaw);
      const sin = Math.sin(yaw);
      const tilt = -0.17;

      function rotate([x, y, z]: Vec): Vec {
        const rx = x * cos + z * sin;

        return [
          rx * Math.cos(tilt) - y * Math.sin(tilt),
          rx * Math.sin(tilt) + y * Math.cos(tilt),
          z * cos - x * sin,
        ];
      }

      const screen = ([x, y]: Vec) => [
        CENTER + x * RADIUS,
        CENTER + y * RADIUS,
      ];

      const exposed = ([x, y, z]: Vec) =>
        z >= 0 || x * x + y * y > 1.025;

      function dot(
        point: Vec,
        radius: number,
        alpha: number
      ) {
        const [x, y] = screen(point);

        ctx!.beginPath();
        ctx!.arc(x, y, radius, 0, TAU);
        ctx!.fillStyle = `rgba(171,225,255,${alpha})`;
        ctx!.fill();
      }

      function line(
        points: Vec[],
        color: string,
        width: number,
        test = exposed
      ) {
        ctx!.beginPath();

        let pen = false;

        for (const point of points) {
          if (!test(point)) {
            pen = false;
            continue;
          }

          const [x, y] = screen(point);

          if (pen) {
            ctx!.lineTo(x, y);
          } else {
            ctx!.moveTo(x, y);
          }

          pen = true;
        }

        ctx!.strokeStyle = color;
        ctx!.lineWidth = width;
        ctx!.stroke();
      }

      const orbit = Array.from(
        { length: 161 },
        (_, i): Vec => {
          const a = (i / 160) * TAU;
          const x = 1.25 * Math.cos(a);
          const y = 0.28 * Math.sin(a);

          return [
            x * 0.95 + y * 0.31,
            -x * 0.31 + y * 0.95,
            0.92 * Math.sin(a),
          ];
        }
      );

      // Parte posterior de la órbita.
      line(
        orbit,
        "rgba(83,103,255,.23)",
        1,
        ([, , z]) => z < 0
      );

      const glow = ctx.createRadialGradient(
        CENTER,
        CENTER,
        RADIUS * 0.98,
        CENTER,
        CENTER,
        RADIUS * 1.12
      );

      glow.addColorStop(0, "rgba(28,73,255,0)");
      glow.addColorStop(0.2, "rgba(48,87,255,.13)");
      glow.addColorStop(1, "rgba(23,46,180,0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, SIZE, SIZE);

      surface ??= createSurface();

      if (surface) {
        surface.render(yaw);

        ctx.drawImage(
          surface.surface,
          CENTER - RADIUS,
          CENTER - RADIUS,
          RADIUS * 2,
          RADIUS * 2
        );
      }

      for (const path of grid) {
        line(
          path.map(rotate),
          "rgba(66,121,235,.17)",
          0.6,
          ([, , z]) => z > 0.02
        );
      }

      const rim = ctx.createLinearGradient(
        105,
        100,
        530,
        515
      );

      rim.addColorStop(0, "#b1edff");
      rim.addColorStop(0.28, "#448dff");
      rim.addColorStop(0.58, "#6650ff");
      rim.addColorStop(1, "rgba(36,53,119,.05)");

      ctx.beginPath();
      ctx.arc(CENTER, CENTER, RADIUS + 1, 0, TAU);
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = "#366fff";
      ctx.shadowBlur = 9;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Conexiones y pulsos que acompañan la rotación.
      routes.forEach((path, i) => {
        const projected = path.map(rotate);

        line(
          projected,
          "rgba(109,150,255,.42)",
          0.85
        );

        const point =
          projected[
            Math.floor(((time * 0.14 + i * 0.19) % 1) * 48)
          ];

        if (exposed(point)) {
          dot(point, 5, 0.08);
          dot(point, 1.6, 0.95);
        }
      });

      cities.forEach((city, i) => {
        const point = rotate(city);

        if (point[2] < 0.06) return;

        const pulse =
          0.6 + Math.sin(time * 2 + i) * 0.25;

        dot(point, 6, pulse * 0.13);
        dot(point, 2, pulse);
      });

      // Parte delantera de la órbita.
      line(
        orbit,
        "rgba(102,133,255,.6)",
        1,
        ([, , z]) => z >= 0
      );

      const satellite =
        orbit[
          Math.floor(((time * 0.045 + 0.12) % 1) * 160)
        ];

      if (exposed(satellite)) {
        dot(satellite, 7, 0.1);
        dot(satellite, 2.2, 0.95);
      }
    }

    function active() {
      return (
        !disposed &&
        visible &&
        !document.hidden &&
        !motion.matches &&
        document.documentElement.dataset.ludenTheme !==
          "editorial" &&
        !!canvas?.clientWidth
      );
    }

    function tick(now: number) {
      frame = 0;

      if (!active()) return;
      if (!previous) previous = now;

      if (now - previous >= 1000 / 30) {
        elapsed += Math.min(
          (now - previous) / 1000,
          0.08
        );

        previous = now;
        draw(elapsed);
      }

      frame = requestAnimationFrame(tick);
    }

    function sync() {
      if (frame) cancelAnimationFrame(frame);

      frame = 0;
      previous = 0;

      if (!canvas?.clientWidth) return;

      const pixels = Math.round(
        canvas.clientWidth *
          Math.min(window.devicePixelRatio || 1, 1.5)
      );

      if (canvas.width !== pixels) {
        canvas.width = pixels;
        canvas.height = pixels;
      }

      scale = pixels / SIZE;
      draw(elapsed);

      if (active()) {
        frame = requestAnimationFrame(tick);
      }
    }

    const resize = new ResizeObserver(sync);
    resize.observe(canvas);

    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      }
    );

    intersection.observe(canvas);

    const theme = new MutationObserver(sync);

    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-luden-theme"],
    });

    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);

    sync();

    return () => {
      disposed = true;

      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      theme.disconnect();

      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className={s.worldDock}>
      <div className={s.world}>
        <span className={s.worldAura} />

        <canvas
          ref={canvasRef}
          className={s.worldCanvas}
        />

        <span className={s.worldSignal}>
          LUDEN / DIGITAL UNIVERSE
        </span>

        <div className={s.worldCaption}>
          <span className={s.worldPreview} />

          <span>
            PROYECTOS
            <br />
            QUE TRASCIENDEN
          </span>

          <small>
            MARCAS · PERSONAS · EXPERIENCIAS
          </small>
        </div>
      </div>
    </div>
  );
}

function Circuit({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`${s.circuit} ${className}`}
      viewBox="0 0 1440 220"
      fill="none"
      preserveAspectRatio="none"
    >
      <g className={s.circuitBase}>
        <path d="M0 48H196L226 78H418L449 47H603M0 174H290L324 140H505M1440 35H1245L1214 66H1010L977 99H855M1440 180H1174L1140 146H950L920 176H734" />
        <path d="M15 124V24L35 4H395M1424 91V202H1098M599 42H757L784 69H872" />
      </g>

      <g className={s.circuitPulse}>
        <path
          pathLength="100"
          d="M0 48H196L226 78H418L449 47H603"
        />
        <path
          pathLength="100"
          d="M1440 180H1174L1140 146H950L920 176H734"
        />
        <path
          pathLength="100"
          d="M1440 35H1245L1214 66H1010L977 99H855"
        />
      </g>

      <g className={s.circuitNodes}>
        <circle cx="603" cy="47" r="2.7" />
        <circle cx="505" cy="140" r="2.7" />
        <circle cx="855" cy="99" r="2.7" />
        <circle cx="734" cy="176" r="2.7" />

        <path d="M655 106v18m-9-9h18M1074 16v16m-8-8h16M110 200v14m-7-7h14" />
      </g>
    </svg>
  );
}

export default function CyberProjectsEffects({
  anchorRef,
  bridgeRef,
}: Props) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHost(
      anchorRef.current?.closest<HTMLElement>(
        "#proyectos"
      ) ?? null
    );
  }, [anchorRef]);

  useEffect(() => {
    const layer = layerRef.current;
    const anchor = anchorRef.current;
    const bridge = bridgeRef.current;

    if (!host || !layer || !anchor) return;

    let visible = false;

    function measure() {
      if (!host || !layer || !anchor || !anchor.offsetWidth) {
        return;
      }

      const base = host.getBoundingClientRect();
      const box = anchor.getBoundingClientRect();

      layer.style.setProperty(
        "--stage-top",
        `${box.top - base.top}px`
      );

      layer.style.setProperty(
        "--stage-left",
        `${box.left - base.left}px`
      );

      layer.style.setProperty(
        "--stage-width",
        `${box.width}px`
      );

      if (bridge) {
        layer.style.setProperty(
          "--bridge-top",
          `${bridge.getBoundingClientRect().top - base.top}px`
        );
      }
    }

    function sync() {
      if (!layer) return;

      layer.dataset.running = String(
        visible &&
          !document.hidden &&
          document.documentElement.dataset.ludenTheme !==
            "editorial"
      );

      measure();
    }

    const resize = new ResizeObserver(measure);

    resize.observe(host);
    resize.observe(anchor);

    if (bridge) resize.observe(bridge);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });

    observer.observe(host);

    const theme = new MutationObserver(sync);

    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-luden-theme"],
    });

    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", measure);

    measure();

    return () => {
      resize.disconnect();
      observer.disconnect();
      theme.disconnect();

      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", measure);
    };
  }, [host, anchorRef, bridgeRef]);

  if (!host) return null;

  return createPortal(
    <div
      ref={layerRef}
      className={s.sectionFx}
      aria-hidden="true"
    >
      <div className={s.nebula} />
      <div className={s.spaceGrid} />

      {Array.from({ length: 100 }, (_, i) => (
        <i
          key={i}
          className={`${s.star} ${
            i % 13 === 0 ? s.spark : ""
          }`}
          style={
            {
              left: `${(i * 61.8034) % 100}%`,
              top: `${(i * 37.719 + 3) % 100}%`,
              "--size": `${i % 5 === 0 ? 2.5 : 1.2}px`,
              "--delay": `${-i * 0.63}s`,
              "--duration": `${3 + (i % 5)}s`,
            } as CSSProperties
          }
        />
      ))}

      <DigitalWorld />

      {[
        s.fxTop,
        s.fxAcross,
        s.fxMiddle,
        s.fxBottom,
      ].map((zone, z) => (
        <div
          key={zone}
          className={`${s.fxBand} ${zone}`}
        >
          <Circuit />

          {Array.from({ length: 5 }, (_, i) => (
            <i
              key={i}
              className={s.meteor}
              style={
                {
                  left: `${5 + ((i * 21 + z * 13) % 87)}%`,
                  top: `${12 + ((i * 29 + z * 17) % 75)}%`,
                  "--delay": `${-i * 1.7 - z * 2.4}s`,
                  "--duration": `${6.5 + i * 0.85}s`,
                  "--length": `${100 + (i % 3) * 46}px`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}

      <span className={s.edgeRail} />
    </div>,
    host
  );
}