"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import CyberProjectsEffects from "./CyberProjectsEffects";
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

export default function CyberProjectsStage({
  featured,
  others,
  onOpen,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [atEnd, setAtEnd] = useState(false);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const left = track.getBoundingClientRect().left;

    let nearest = 0;
    let minDistance = Infinity;

    Array.from(track.children).forEach((element, i) => {
      const distance = Math.abs(
        element.getBoundingClientRect().left - left
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearest = i;
      }
    });

    setActiveSlide(nearest);

    setAtEnd(
      track.scrollLeft + track.clientWidth >=
        track.scrollWidth - 3
    );
  }, []);

  useEffect(() => {
    handleScroll();

    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;

    const targetIndex = Math.min(
      Math.max(index, 0),
      others.length - 1
    );

    const element = track.children[targetIndex] as
      | HTMLElement
      | undefined;

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
      ref={stageRef}
      className={s.stage}
      id="proyectos-cyber"
    >
      <CyberProjectsEffects
        anchorRef={stageRef}
        bridgeRef={bridgeRef}
      />

      {/* PROYECTOS DESTACADOS */}
      <div
        className={s.cards}
        aria-label="Proyectos destacados"
      >
        {featured.slice(0, 4).map((project, index) => (
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
                    {String(index + 1).padStart(2, "0")} / 04
                  </span>

                  <span>
                    {project.category.toUpperCase()}
                  </span>

                  <span className={s.panelPlus}>+</span>
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
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={s.panelLink}
                    onClick={() => onOpen(project)}
                  >
                    VER PROYECTO{" "}
                    <span aria-hidden="true">→</span>
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
        ))}
      </div>

      {/* ESPACIO CON EFECTOS ENTRE AMBOS BLOQUES */}
      <div
        ref={bridgeRef}
        className={s.bridge}
        aria-hidden="true"
      >
        <span>
          DISEÑO · TECNOLOGÍA · NUEVAS POSIBILIDADES
        </span>

        <i />

        <span>SIGUE EXPLORANDO ↓</span>
      </div>

      {/* OTROS PROYECTOS */}
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
            Una selección de proyectos que también forman
            parte de nuestro laboratorio.
          </p>
        </div>

        <div className={s.carouselRow}>
          <button
            type="button"
            className={s.carouselArrow}
            onClick={() => goTo(activeSlide - 1)}
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
            onClick={() => goTo(activeSlide + 1)}
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
            {String(activeSlide + 1).padStart(2, "0")}
          </span>

          {others.map((project, i) => (
            <button
              type="button"
              key={project.id}
              aria-label={`Ir a ${project.name}`}
              aria-current={
                activeSlide === i ? "true" : undefined
              }
              className={
                activeSlide === i ? s.currentDot : ""
              }
              onClick={() => goTo(i)}
            />
          ))}

          <span>
            {String(others.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className={s.stageEnd} aria-hidden="true" />
    </div>
  );
}