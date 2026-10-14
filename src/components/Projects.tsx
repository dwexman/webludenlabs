
"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import CyberProjectsStage, {
  type Project,
} from "./CyberProjectsStage";
import styles from "./Projects.module.css";

// =============================================
// PROYECTOS DESTACADOS — DATOS PROVISIONALES
// =============================================

const featuredProjects: Project[] = [
  {
    id: "alba",
    name: "ALBA",
    category: "Experiencia digital",
    subtitle: "Tecnología que acompaña.",
    description:
      "Una experiencia interactiva que conecta diseño, movimiento y tecnología centrada en las personas.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85",
    position: "center 35%",
    tags: ["Software", "Experiencia", "Innovación"],
  },
  {
    id: "imperio-fit",
    name: "Imperio Fit",
    category: "Web / Plataforma",
    subtitle: "Disciplina que conecta.",
    description:
      "Un ecosistema digital para acercar entrenamiento, comunidad y nuevas formas de avanzar.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=85",
    tags: ["Web", "Plataforma", "Estrategia"],
  },
  {
    id: "fluye",
    name: "FluYe",
    category: "Sitio web",
    subtitle: "Tecnología en movimiento.",
    description:
      "Una vitrina digital de productos y soluciones, diseñada para explorar información de forma clara.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=85",
    tags: ["Web", "Catálogo", "Desarrollo"],
  },
  {
    id: "rebound-rise",
    name: "Rebound & Rise",
    category: "Web / Comunidad",
    subtitle: "Historias que impulsan.",
    description:
      "Una experiencia digital para conectar personas, experiencias y nuevas oportunidades.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85",
    tags: ["Web", "Comunidad", "Contenido"],
  },
];

// =============================================
// OTROS PROYECTOS — DATOS PROVISIONALES
// =============================================

const otherProjects: Project[] = [
  {
    id: "nebula",
    name: "Nébula",
    category: "Identidad digital",
    subtitle: "Nuevas perspectivas.",
    description: "Concepto de identidad digital de demostración.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=720&q=80",
    tags: ["Branding", "Digital"],
  },
  {
    id: "aura",
    name: "Aura",
    category: "Plataforma",
    subtitle: "Diseño que conecta.",
    description: "Plataforma de demostración.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=720&q=80",
    tags: ["Plataforma", "UX/UI"],
  },
  {
    id: "vortice",
    name: "Vórtice",
    category: "Producto digital",
    subtitle: "Ideas en evolución.",
    description:
      "Exploración visual de un producto digital ficticio.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=720&q=80",
    tags: ["Producto", "Diseño"],
  },
  {
    id: "kaizen",
    name: "Kaizen",
    category: "Comunidad",
    subtitle: "Siempre hacia adelante.",
    description: "Concepto de comunidad digital.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=720&q=80",
    tags: ["Web", "Comunidad"],
  },
  {
    id: "origen",
    name: "Origen",
    category: "Identidad de marca",
    subtitle: "De la idea al mundo.",
    description: "Concepto de identidad visual de demostración.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=720&q=80",
    tags: ["Marca", "Identidad"],
  },
  {
    id: "pulso",
    name: "Pulso",
    category: "Contenido",
    subtitle: "Conexiones reales.",
    description: "Concepto de contenido digital de demostración.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=720&q=80",
    tags: ["Contenido", "Digital"],
  },
  {
    id: "prisma",
    name: "Prisma",
    category: "Dirección creativa",
    subtitle: "Nuevos enfoques.",
    description: "Exploración de dirección creativa.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=720&q=80",
    tags: ["Dirección", "Creatividad"],
  },
  {
    id: "atlas",
    name: "Atlas",
    category: "Web",
    subtitle: "Nuevas rutas.",
    description: "Sitio conceptual de demostración.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=720&q=80",
    tags: ["Web", "Desarrollo"],
  },
  {
    id: "nexo",
    name: "Nexo",
    category: "Plataforma",
    subtitle: "Conectar ideas.",
    description: "Plataforma conceptual de demostración.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80",
    tags: ["Plataforma", "UX"],
  },
  {
    id: "orbita",
    name: "Órbita",
    category: "Contenido",
    subtitle: "Más allá de lo habitual.",
    description:
      "Proyecto de contenido digital de demostración.",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=720&q=80",
    tags: ["Contenido", "Digital"],
  },
];

function imageStyle(project: Project): CSSProperties {
  return {
    "--project-image": `url("${project.image}")`,
    "--project-position": project.position || "center",
  } as CSSProperties;
}

export default function Projects() {
  const [currentProject, setCurrentProject] = useState(0);
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [sliderAtEnd, setSliderAtEnd] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const current = featuredProjects[currentProject];

  useEffect(() => {
    if (!selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProject]);

  useEffect(() => {
    const checkEnd = () => {
      const el = sliderRef.current;
      if (!el) return;

      setSliderAtEnd(
        el.scrollLeft + el.clientWidth >=
          el.scrollWidth - 3
      );
    };

    checkEnd();
    window.addEventListener("resize", checkEnd);

    return () =>
      window.removeEventListener("resize", checkEnd);
  }, []);

  function scrollToSlide(index: number) {
    const slider = sliderRef.current;
    if (!slider) return;

    const bounded = Math.max(
      0,
      Math.min(otherProjects.length - 1, index)
    );

    const item = slider.children[bounded] as
      | HTMLElement
      | undefined;

    if (!item) return;

    const delta =
      item.getBoundingClientRect().left -
      slider.getBoundingClientRect().left;

    slider.scrollTo({
      left: slider.scrollLeft + delta,
      behavior: "smooth",
    });

    setSliderIndex(bounded);
  }

  function updateSlideOnScroll() {
    const slider = sliderRef.current;
    if (!slider) return;

    const left = slider.getBoundingClientRect().left;
    let nearest = 0;
    let distance = Infinity;

    Array.from(slider.children).forEach((node, index) => {
      const d = Math.abs(
        node.getBoundingClientRect().left - left
      );

      if (d < distance) {
        distance = d;
        nearest = index;
      }
    });

    setSliderIndex(nearest);

    setSliderAtEnd(
      slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 3
    );
  }

  function explore() {
    const editorial =
      document.documentElement.dataset.ludenTheme ===
      "editorial";

    if (editorial) {
      editorialRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      document
        .getElementById("proyectos-cyber")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }
  }

  return (
    <section
      id="proyectos"
      className={styles.section}
      aria-label="Proyectos de Luden Labs"
    >
      <div className={styles.gridTexture} aria-hidden="true" />

      <div className={styles.container}>
        {/* INTRO CYBER */}

        <div className={styles.cyberIntro}>
          <div className={styles.cyberIntroMain}>
            <span className={styles.eyebrow}>
              // LUDEN LABS · PROYECTOS
            </span>

            <h2 className={styles.cyberTitle}>
              Lo que <em>creamos.</em>
            </h2>

            <p className={styles.lettered}>
              IDEAS · TECNOLOGÍA · EXPERIENCIAS
            </p>

            <p className={styles.cyberLead}>
              Un laboratorio de experiencias digitales donde
              el diseño, la estrategia y la tecnología se
              encuentran.
            </p>

            <button
              type="button"
              className={styles.exploreButton}
              onClick={explore}
            >
              <span
                className={styles.roundArrow}
                aria-hidden="true"
              >
                →
              </span>
              <span>EXPLORAR PROYECTOS</span>
            </button>
          </div>

          <div
            className={styles.cyberIntroMiddle}
            aria-hidden="true"
          >
            <span className={styles.techLabel}>
              // EXPERIMENTAL INTERFACE
            </span>
            <span>
              01 <b>ESTRATEGIA</b>
            </span>
            <span>
              02 <b>DISEÑO</b>
            </span>
            <span>
              03 <b>TECNOLOGÍA</b>
            </span>
            <span>
              04 <b>IMPACTO REAL</b>
            </span>
          </div>

          <div className={styles.cyberIntroQuote}>
            <p>“Convertimos ideas en realidades digitales.”</p>
            <span>DISEÑAR · CREAR · EVOLUCIONAR</span>
          </div>
        </div>

        {/* INTRO EDITORIAL */}

        <div className={styles.editorialIntro}>
          <div>
            <span className={styles.editorialEyebrow}>
              PORTAFOLIO / LUDEN LABS
            </span>
            <h2>
              Proyectos
              <br />
              seleccionados<span>.</span>
            </h2>
          </div>

          <p>
            Ideas que se convierten en marcas, productos y
            experiencias digitales con impacto real.
          </p>

          <div className={styles.editorialMeta}>
            <span>ESTRATEGIA / DISEÑO / TECNOLOGÍA</span>
            <i />
            <small>
              CREATIVIDAD CON DIRECCIÓN Y PROPÓSITO.
            </small>
          </div>
        </div>

        {/* EDITORIAL: SHOWCASE + CARRUSEL JUNTOS */}

        <div
          className={styles.editorialShowcase}
          ref={editorialRef}
        >
          <div
            className={styles.editorialList}
            role="group"
            aria-label="Seleccionar proyecto"
          >
            {featuredProjects.map((project, index) => (
              <button
                type="button"
                key={project.id}
                className={`${styles.editorialListItem} ${
                  index === currentProject
                    ? styles.isSelected
                    : ""
                }`}
                aria-pressed={index === currentProject}
                onClick={() => setCurrentProject(index)}
              >
                <span className={styles.editorialNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className={styles.editorialListContent}>
                  <strong>{project.name}</strong>
                  <small>{project.category}</small>
                </span>

                <span
                  className={styles.editorialListArrow}
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            ))}

            <p className={styles.editorialFootnote}>
              <span className={styles.statusDot} />
              UNA SELECCIÓN DE NUESTRO TRABAJO
            </p>
          </div>

          <div
            className={styles.editorialDetail}
            key={current.id}
          >
            <button
              type="button"
              className={styles.editorialHero}
              style={imageStyle(current)}
              onClick={() => setSelectedProject(current)}
              aria-label={`Ver proyecto ${current.name}`}
            >
              <span className={styles.editorialHeroTop}>
                <span>
                  {String(currentProject + 1).padStart(
                    2,
                    "0"
                  )}{" "}
                  / 04
                </span>
                <span>{current.category}</span>
              </span>

              <span className={styles.editorialHeroName}>
                {current.name}
              </span>

              <span className={styles.editorialHeroBottom}>
                VER PROYECTO{" "}
                <span aria-hidden="true">↗</span>
              </span>
            </button>

            <div className={styles.editorialDetailHeader}>
              <span>{current.name.toUpperCase()}</span>
              <small>
                {current.year} / {current.category}
              </small>
            </div>

            <h3>{current.subtitle}</h3>

            <p className={styles.editorialDescription}>
              {current.description}
            </p>

            <div className={styles.editorialDetailActions}>
              <div className={styles.tags}>
                {current.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(current)}
              >
                VER PROYECTO{" "}
                <span aria-hidden="true">→</span>
              </button>
            </div>

            <div
              className={styles.editorialThumbnails}
              aria-hidden="true"
            >
              <div style={imageStyle(current)}>
                <span>VISIÓN</span>
              </div>

              <div
                style={imageStyle(
                  otherProjects[
                    (currentProject + 2) %
                      otherProjects.length
                  ]
                )}
              >
                <span>DETALLES</span>
              </div>

              <div
                style={imageStyle(
                  otherProjects[
                    (currentProject + 4) %
                      otherProjects.length
                  ]
                )}
              >
                <span>EXPERIENCIA</span>
              </div>
            </div>
          </div>

          {/* ESTE CARRUSEL PERTENECE SOLO AL EDITORIAL */}

          <div
            className={styles.moreProjects}
            style={{ gridColumn: "1 / -1" }}
            data-editorial-only-carousel
          >
            <div className={styles.moreHeader}>
              <div>
                <span className={styles.moreEyebrow}>
                  // MÁS PROYECTOS
                </span>
                <h3>
                  Otros proyectos<span>.</span>
                </h3>
              </div>

              <p>
                MÁS IDEAS. MÁS MARCAS. MÁS EXPERIENCIAS.
              </p>

              <span className={styles.moreHint}>
                Explora otros trabajos de nuestro laboratorio
                digital.
              </span>
            </div>

            <div className={styles.carouselContainer}>
              <button
                type="button"
                className={styles.sliderArrow}
                aria-label="Ver proyectos anteriores"
                onClick={() =>
                  scrollToSlide(sliderIndex - 1)
                }
                disabled={sliderIndex === 0}
              >
                ←
              </button>

              <div
                className={styles.carouselTrack}
                ref={sliderRef}
                onScroll={updateSlideOnScroll}
                aria-label="Carrusel de otros proyectos"
                role="region"
              >
                {otherProjects.map((project, index) => (
                  <button
                    type="button"
                    className={styles.miniCard}
                    style={imageStyle(project)}
                    key={project.id}
                    onClick={() =>
                      setSelectedProject(project)
                    }
                    aria-label={`Ver proyecto ${project.name}`}
                  >
                    <span
                      className={styles.miniImage}
                      aria-hidden="true"
                    />

                    <span className={styles.miniCardBottom}>
                      <span>
                        <strong>{project.name}</strong>
                        <small>{project.category}</small>
                      </span>
                      <span
                        className={styles.miniArrow}
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </span>

                    <span
                      className={styles.miniIndex}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={styles.sliderArrow}
                aria-label="Ver proyectos siguientes"
                onClick={() =>
                  scrollToSlide(sliderIndex + 1)
                }
                disabled={sliderAtEnd}
              >
                →
              </button>
            </div>

            <div
              className={styles.pagination}
              aria-label="Posición del carrusel"
            >
              <span>
                {String(sliderIndex + 1).padStart(2, "0")}
              </span>

              {otherProjects.map((project, index) => (
                <button
                  type="button"
                  key={project.id}
                  className={
                    index === sliderIndex
                      ? styles.paginationActive
                      : ""
                  }
                  onClick={() => scrollToSlide(index)}
                  aria-label={`Ir a ${project.name}`}
                  aria-current={
                    index === sliderIndex
                      ? "true"
                      : undefined
                  }
                />
              ))}

              <span>
                {String(otherProjects.length).padStart(
                  2,
                  "0"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* CYBER: SU PROPIO SHOWCASE Y SU PROPIO SLIDER */}

        <CyberProjectsStage
          featured={featuredProjects}
          others={otherProjects}
          onOpen={setSelectedProject}
        />

        <div
          className={styles.bottomLine}
          aria-hidden="true"
        >
          <span>
            LUDEN LABS / DIGITAL CREATION STUDIO
          </span>
          <span>EXPERIMENT. BUILD. EVOLVE.</span>
          <span>IDEAS · PERSONAS · IMPACTO</span>
        </div>
      </div>

      {selectedProject &&
        createPortal(
          <div
            className={styles.modalBackdrop}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedProject(null);
              }
            }}
          >
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-detail-title"
            >
              <button
                ref={closeRef}
                className={styles.modalClose}
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Cerrar proyecto"
              >
                ×
              </button>

              <div
                className={styles.modalImage}
                style={imageStyle(selectedProject)}
              />

              <div className={styles.modalContent}>
                <span className={styles.modalEyebrow}>
                  LUDEN LABS / PROYECTO DE EJEMPLO
                </span>

                <h3 id="project-detail-title">
                  {selectedProject.name}
                </h3>

                <strong>{selectedProject.subtitle}</strong>
                <p>{selectedProject.description}</p>

                <div className={styles.tags}>
                  {selectedProject.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <p className={styles.modalNote}>
                  Este contenido es provisional. Aquí
                  agregaremos las imágenes, la información
                  y los enlaces del proyecto real.
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}
