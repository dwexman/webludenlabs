
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import s from "./CyberProjectsStage.module.css";

export type Project = {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  year: string;
  image: string;
  position?: string;
  tags: string[];
};

type Props = {
  featured: Project[];
  others: Project[];
  onOpen: (project: Project) => void;
};

function imageVariables(project: Project): CSSProperties {
  return {
    "--art": `url("${project.image}")`,
    "--art-position": project.position || "center",
  } as CSSProperties;
}

/* ==========================================
   PLANETA DIGITAL

   Canvas permite crear textura, sombras,
   relieve y luz sin depender de imágenes.
========================================== */

function DigitalWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
    });

    if (!ctx) return;

    const S = 620;
    const C = S / 2;
    const R = 255;

    canvas.width = S;
    canvas.height = S;

    const image = ctx.createImageData(S, S);
    const data = image.data;

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const nx = (x - C) / R;
        const ny = (y - C) / R;
        const rr = nx * nx + ny * ny;

        if (rr >= 1) continue;

        const nz = Math.sqrt(1 - rr);

        const light = Math.max(
          0.035,
          -nx * 0.52 - ny * 0.53 + nz * 0.49
        );

        const land =
          Math.sin(
            nx * 17 + Math.sin(ny * 18) * 2.4
          ) *
            Math.cos(ny * 14 - nx * 9) *
            0.5 +
          Math.sin(nx * 45 - ny * 23) *
            Math.cos(ny * 36 + nx * 12) *
            0.18 +
          Math.sin(nx * 91 + ny * 72) *
            Math.cos(ny * 78) *
            0.065;

        const ridge = Math.abs(
          Math.sin(
            nx * 37 +
              Math.sin(ny * 19) * 3.2
          ) *
            Math.cos(
              ny * 32 -
                Math.sin(nx * 23) * 2.1
            )
        );

        const brightTerrain =
          Math.max(0, land + 0.18) * 35;

        const fracture =
          ridge < 0.055 && light > 0.22
            ? 16 * light
            : 0;

        const shade = Math.pow(light, 1.45);

        const rim =
          Math.pow(1 - nz, 4) *
          (nx < 0 || ny < 0 ? 0.85 : 0.3);

        const luminous = Math.max(
          0,
          65 * shade +
            brightTerrain +
            fracture
        );

        const i = (y * S + x) * 4;

        data[i] = Math.min(
          255,
          3 + luminous * 0.3 + 38 * rim
        );

        data[i + 1] = Math.min(
          255,
          8 + luminous * 0.72 + 86 * rim
        );

        data[i + 2] = Math.min(
          255,
          24 + luminous * 1.55 + 160 * rim
        );

        data[i + 3] = Math.round(
          255 *
            Math.min(1, (1 - rr) * 85)
        );
      }
    }

    ctx.putImageData(image, 0, 0);

    ctx.save();
    ctx.beginPath();
    ctx.arc(C, C, R, 0, Math.PI * 2);
    ctx.clip();

    // Líneas geodésicas sutiles.

    ctx.strokeStyle =
      "rgba(102,166,255,.12)";
    ctx.lineWidth = 0.9;

    for (const f of [
      -0.75,
      -0.5,
      -0.25,
      0,
      0.25,
      0.5,
      0.75,
    ]) {
      ctx.beginPath();

      ctx.ellipse(
        C,
        C,
        Math.max(
          7,
          R * Math.sqrt(1 - f * f)
        ),
        R,
        0,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    }

    for (const f of [
      -0.74,
      -0.48,
      -0.24,
      0.12,
      0.37,
      0.6,
      0.79,
    ]) {
      ctx.beginPath();

      ctx.ellipse(
        C,
        C + f * R,
        R * Math.sqrt(1 - f * f),
        18 * (1 - Math.abs(f) * 0.3),
        0,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    }

    // Puntos luminosos sobre la superficie.

    for (let i = 0; i < 450; i++) {
      const a = i * 2.399963;

      const r =
        R *
        Math.sqrt(
          (i + 0.5) / 450
        );

      const x = C + Math.cos(a) * r;
      const y = C + Math.sin(a) * r;

      const visibility = Math.max(
        0.12,
        1 - r / R
      );

      const alpha =
        i % 17 === 0 ? 0.55 : 0.09;

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        i % 17 === 0 ? 1.25 : 0.55,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(114,177,255,${
        alpha * visibility
      })`;

      ctx.fill();
    }

    ctx.restore();

    // Arcos metálicos discontinuos.

    const ring = ctx.createLinearGradient(
      60,
      75,
      530,
      535
    );

    ring.addColorStop(
      0,
      "rgba(100,225,255,.95)"
    );

    ring.addColorStop(
      0.42,
      "rgba(63,126,255,.82)"
    );

    ring.addColorStop(
      0.73,
      "rgba(144,83,255,.76)"
    );

    ring.addColorStop(
      1,
      "rgba(79,43,183,.07)"
    );

    ctx.lineCap = "round";
    ctx.strokeStyle = ring;
    ctx.lineWidth = 3.3;

    ctx.shadowColor =
      "rgba(75,122,255,.65)";
    ctx.shadowBlur = 17;

    ctx.beginPath();

    ctx.arc(
      C,
      C,
      R + 3,
      Math.PI * 0.82,
      Math.PI * 1.63
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
      C,
      C,
      R + 3,
      Math.PI * 1.67,
      Math.PI * 1.93
    );

    ctx.stroke();
    ctx.shadowBlur = 0;
  }, []);

  return (
    <div
      className={s.world}
      aria-hidden="true"
    >
      <span className={s.worldAtmosphere} />

      <canvas
        ref={canvasRef}
        className={s.worldCanvas}
      />

      <span className={s.worldOrbit} />

      <span className={s.worldSignal}>
        LUDEN / DIGITAL UNIVERSE
      </span>
    </div>
  );
}

/* ==========================================
   ESTRELLAS FUGACES + DETALLES HUD
========================================== */

function CyberAtmosphere() {
  const meteors = [
    ["8%", "8%", "-3s", "13s"],
    ["12%", "68%", "-8s", "11s"],
    ["23%", "43%", "-5s", "14s"],
    ["29%", "84%", "-9s", "16s"],
    ["39%", "14%", "-2s", "12s"],
    ["48%", "58%", "-7s", "15s"],
    ["57%", "87%", "-11s", "14s"],
    ["67%", "31%", "-4s", "13s"],
    ["76%", "73%", "-10s", "17s"],
    ["87%", "18%", "-6s", "12s"],
    ["93%", "53%", "-12s", "15s"],
  ];

  return (
    <div
      className={s.atmosphere}
      aria-hidden="true"
    >
      <div className={s.stars}>
        {meteors.map(
          (
            [top, left, delay, duration],
            i
          ) => (
            <i
              key={i}
              className={s.meteor}
              style={
                {
                  top,
                  left,
                  "--delay": delay,
                  "--duration": duration,
                  "--length": `${
                    80 + (i % 4) * 27
                  }px`,
                } as CSSProperties
              }
            />
          )
        )}
      </div>

      <svg
        className={s.hudFrame}
        viewBox="0 0 1440 520"
        fill="none"
        preserveAspectRatio="none"
      >
        <g
          stroke="#467FFF"
          strokeOpacity=".42"
          strokeWidth="1"
        >
          <path d="M15 218V105L48 70H390L416 96H555" />
          <path d="M15 318V283L42 256H310" />
          <path d="M485 43H762L790 71V172" />
          <path d="M903 78V172L931 201H1163" />
          <path d="M1205 130H1389V305L1357 337H1240" />
          <path d="M24 464H404L443 425H705" />
          <path d="M750 409H1052L1083 440H1421" />
        </g>

        <g
          stroke="#74C6FF"
          strokeWidth="2"
          strokeOpacity=".7"
        >
          <path d="M16 217V126L48 94" />
          <path d="M930 199H1010" />
          <path d="M16 463H95" />
          <path d="M1292 337H1360" />
        </g>

        <g
          stroke="#905CFF"
          strokeOpacity=".62"
          strokeWidth="2"
        >
          <path d="M1130 171H1250" />
          <path d="M485 43H543" />
          <path d="M554 94H627" />
        </g>

        <g fill="#55A7FF">
          <circle cx="790" cy="171" r="2" />
          <circle cx="1053" cy="409" r="2" />
          <circle cx="415" cy="96" r="2" />
        </g>
      </svg>
    </div>
  );
}

export default function CyberProjectsStage({
  featured,
  others,
  onOpen,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const left =
      track.getBoundingClientRect().left;

    let nearest = 0;
    let minDistance = Infinity;

    Array.from(track.children).forEach(
      (element, i) => {
        const distance = Math.abs(
          element.getBoundingClientRect().left -
            left
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearest = i;
        }
      }
    );

    setActiveSlide(nearest);

    setAtEnd(
      track.scrollLeft + track.clientWidth >=
        track.scrollWidth - 3
    );
  }, []);

  useEffect(() => {
    handleScroll();

    window.addEventListener(
      "resize",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleScroll
      );
  }, [handleScroll]);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;

    const targetIndex = Math.min(
      Math.max(index, 0),
      others.length - 1
    );

    const element = track.children[
      targetIndex
    ] as HTMLElement | undefined;

    if (!element) return;

    const distance =
      element.getBoundingClientRect().left -
      track.getBoundingClientRect().left;

    track.scrollTo({
      left: track.scrollLeft + distance,
      behavior: "smooth",
    });

    setActiveSlide(targetIndex);
  }

  return (
    <div
      className={s.stage}
      id="proyectos-cyber"
    >
      <div
        className={s.digitalBack}
        aria-hidden="true"
      />

      <CyberAtmosphere />
      <DigitalWorld />

      <div
        className={s.worldCaption}
        aria-hidden="true"
      >
        <span>
          // PROYECTOS QUE TRASCIENDEN
        </span>
        <span>
          MARCAS / PERSONAS / EXPERIENCIAS
        </span>
      </div>

      {/* CUATRO PROYECTOS PRINCIPALES */}

      <div
        className={s.cards}
        aria-label="Proyectos destacados"
      >
        {featured.slice(0, 4).map(
          (project, index) => (
            <article
              key={project.id}
              className={`${s.panel} ${
                s[`panel${index + 1}`]
              }`}
              style={imageVariables(project)}
            >
              <div
                className={s.backPlateOne}
                aria-hidden="true"
              />
              <div
                className={s.backPlateTwo}
                aria-hidden="true"
              />

              <div className={s.panelFrame}>
                <div className={s.panelInside}>
                  <div
                    className={s.panelImage}
                    aria-hidden="true"
                  />
                  <div
                    className={s.panelVignette}
                    aria-hidden="true"
                  />

                  <div className={s.panelTop}>
                    <span>
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}{" "}
                      / 04
                    </span>
                    <span>
                      {project.category.toUpperCase()}
                    </span>
                    <span className={s.panelPlus}>
                      +
                    </span>
                  </div>

                  <div className={s.panelBody}>
                    <h3>{project.name}</h3>

                    <p className={s.panelSubtitle}>
                      {project.subtitle}
                    </p>

                    <p className={s.panelDescription}>
                      {project.description}
                    </p>

                    <div className={s.panelTags}>
                      {project.tags.map((tag) => (
                        <span key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={s.panelLink}
                      onClick={() => onOpen(project)}
                    >
                      VER PROYECTO{" "}
                      <span aria-hidden="true">
                        →
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className={s.panelSideButton}
                    aria-label={`Ver ${project.name}`}
                    onClick={() => onOpen(project)}
                  >
                    →
                  </button>

                  <div
                    className={s.panelScan}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </article>
          )
        )}
      </div>

      {/* CARRUSEL CYBER */}

      <div className={s.more}>
        <div className={s.moreHeader}>
          <div>
            <span className={s.microLabel}>
              // MÁS PROYECTOS
            </span>

            <h3>
              Otros proyectos<span>.</span>
            </h3>
          </div>

          <span className={s.moreManifesto}>
            MÁS IDEAS. MÁS MARCAS. MÁS REALIDADES.
          </span>

          <p>
            Una selección de proyectos que
            también forman parte de nuestro
            laboratorio.
          </p>
        </div>

        <div className={s.carouselRow}>
          <button
            type="button"
            className={s.carouselArrow}
            onClick={() =>
              goTo(activeSlide - 1)
            }
            disabled={activeSlide === 0}
            aria-label="Proyectos anteriores"
          >
            ←
          </button>

          <div
            ref={trackRef}
            className={s.carouselTrack}
            onScroll={handleScroll}
            role="region"
            aria-label="Otros proyectos"
          >
            {others.map((project, i) => (
              <button
                key={project.id}
                type="button"
                className={s.miniProject}
                onClick={() => onOpen(project)}
                style={imageVariables(project)}
                aria-label={`Ver ${project.name}`}
              >
                <span className={s.miniPhoto} />

                <span className={s.miniContent}>
                  <strong>{project.name}</strong>
                  <small>{project.category}</small>
                  <span aria-hidden="true">↗</span>
                </span>

                <span
                  className={s.miniNumber}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={s.carouselArrow}
            onClick={() =>
              goTo(activeSlide + 1)
            }
            disabled={atEnd}
            aria-label="Proyectos siguientes"
          >
            →
          </button>
        </div>

        <div
          className={s.pagination}
          aria-label="Paginación de proyectos"
        >
          <span>
            {String(activeSlide + 1).padStart(
              2,
              "0"
            )}
          </span>

          {others.map((project, i) => (
            <button
              type="button"
              key={project.id}
              aria-label={`Ir a ${project.name}`}
              aria-current={
                activeSlide === i
                  ? "true"
                  : undefined
              }
              className={
                activeSlide === i
                  ? s.currentDot
                  : ""
              }
              onClick={() => goTo(i)}
            />
          ))}

          <span>
            {String(others.length).padStart(
              2,
              "0"
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
