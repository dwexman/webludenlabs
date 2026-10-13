"use client";

import { useId, useState } from "react";
import styles from "./Services.module.css";

type Service = {
  id: "web" | "mobile" | "marketing" | "brand" | "positioning";
  title: string[];
  subtitle: string;
  description: string;
};

const services: Service[] = [
  {
    id: "web",
    title: ["Desarrollo", "web"],
    subtitle: "Sitios, e-commerce y plataformas.",
    description:
      "Diseñamos y desarrollamos sitios y plataformas a medida, con una experiencia clara, buen rendimiento y foco en los objetivos de tu negocio.",
  },
  {
    id: "mobile",
    title: ["Desarrollo", "mobile"],
    subtitle: "Aplicaciones para iOS y Android.",
    description:
      "Convertimos ideas en aplicaciones móviles intuitivas. Diseñamos cada interacción para crear una experiencia sólida y fácil de usar.",
  },
  {
    id: "marketing",
    title: ["Marketing", "digital"],
    subtitle: "Estrategia, campañas y contenidos.",
    description:
      "Conectamos tu marca con las personas adecuadas mediante contenido, campañas y publicidad digital. Medimos resultados para mejorar cada acción.",
  },
  {
    id: "brand",
    title: ["Identidad", "de marca"],
    subtitle: "Identidad visual y dirección de marca.",
    description:
      "Damos forma a tu identidad visual y a tu voz. Un sistema coherente para que tu marca se reconozca en cada punto de contacto.",
  },
  {
    id: "positioning",
    title: ["Posicionamiento"],
    subtitle: "Diferenciación y visibilidad.",
    description:
      "Definimos qué te diferencia y cómo comunicarlo. Trabajamos tu estrategia y presencia en buscadores para acercarte a tus próximos clientes.",
  },
];

function ServiceIcon({ type }: { type: Service["id"] }) {
  const gradientId = `service-metal-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#49638f" />
          <stop offset="36%" stopColor="#b4c2d8" />
          <stop offset="62%" stopColor="#79638e" />
          <stop offset="100%" stopColor="#4a6592" />
        </linearGradient>
      </defs>

      {type === "web" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <path d="M3 12h18M5 6h14M5 18h14" />
        </>
      )}

      {type === "mobile" && (
        <>
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M10 5h4M11 19h2" />
        </>
      )}

      {type === "marketing" && (
        <>
          <path d="M3 3v18h18" />
          <path d="M7 16v-5M12 16V7M17 16V4" />
        </>
      )}

      {type === "brand" && (
        <>
          <path d="m12 19 7-7 3 3-7 7-3-3Z" />
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18M2 2l6.5 6.5" />
          <circle cx="10" cy="10" r="2" />
        </>
      )}

      {type === "positioning" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
          <path d="M12 1v2M21 12h2M12 21v2M1 12h2" />
        </>
      )}
    </svg>
  );
}

function ArrowIcon({ back = false }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={
          back
            ? "M19 12H5m6-6-6 6 6 6"
            : "M6 18 18 6M6 6h12v12"
        }
      />
    </svg>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const [flipped, setFlipped] = useState(false);
  const descriptionId = useId();
  const name = service.title.join(" ");

  return (
    <button
      type="button"
      className={styles.card}
      data-flipped={flipped}
      aria-label={`${name}: ${flipped ? "ocultar" : "ver"} descripción`}
      aria-expanded={flipped}
      aria-controls={descriptionId}
      aria-describedby={flipped ? descriptionId : undefined}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setFlipped(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setFlipped(false);
      }}
      onClick={() => setFlipped((current) => !current)}
      onBlur={() => setFlipped(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setFlipped(false);
      }}
    >
      <span className={styles.cardInner}>
        <span
          className={`${styles.face} ${styles.front}`}
          aria-hidden={flipped}
        >
          <span className={styles.beam} aria-hidden="true" />

          <span className={styles.icon}>
            <ServiceIcon type={service.id} />
          </span>

          <span className={styles.cardTitle}>
            {service.title.map((line, index) => (
              <span className={styles.titleLine} key={line}>
                {index > 0 ? " " : ""}
                {line}
              </span>
            ))}
          </span>

          <span className={styles.subtitle}>
            {service.subtitle}
          </span>

          <span className={styles.action}>
            <span className={styles.actionLabel}>Explorar</span>
            <ArrowIcon />
          </span>
        </span>

        <span
          className={`${styles.face} ${styles.back}`}
          aria-hidden={!flipped}
        >
          <span className={styles.beam} aria-hidden="true" />

          <span className={styles.backTitle}>{name}</span>

          <span id={descriptionId} className={styles.description}>
            {service.description}
          </span>

          <span className={styles.action}>
            <span className={styles.actionLabel}>Volver</span>
            <ArrowIcon back />
          </span>
        </span>
      </span>
    </button>
  );
}

export default function Services() {
  const titleId = useId();

  return (
    <section
      id="servicios"
      className={styles.section}
      aria-labelledby={titleId}
    >
      <div className={styles.container}>
        <div className={styles.kicker}>
          <span>NUESTROS SERVICIOS</span>
          <span className={styles.signature}>
            DISEÑO / TECNOLOGÍA / ESTRATEGIA
          </span>
        </div>

        <div className={styles.headingRow}>
          <h2 id={titleId} className={styles.heading}>
            Qué hacemos.
          </h2>

          <p className={styles.intro}>
            De la idea al producto.
            <br />
            Experiencias digitales con dirección y propósito.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className={styles.footer}>
          <span>LUDEN LABS</span>
          <span>Pasa el cursor o toca para explorar.</span>
        </div>
      </div>
    </section>
  );
}