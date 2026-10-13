
"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "./Services.module.css";

type ServiceId =
  | "web"
  | "mobile"
  | "marketing"
  | "brand"
  | "positioning";

type Service = {
  id: ServiceId;
  title: string[];
  subtitle: string;
  description: string;
  image: string;
};

const services: Service[] = [
  {
    id: "web",
    title: ["Desarrollo", "web"],
    subtitle: "Sitios, e-commerce y plataformas.",
    description:
      "Diseñamos y desarrollamos sitios y plataformas a medida, con una experiencia clara, buen rendimiento y foco en los objetivos de tu negocio.",
    image: "/images/servicioweb.png",
  },
  {
    id: "mobile",
    title: ["Desarrollo", "mobile"],
    subtitle: "Aplicaciones para iOS y Android.",
    description:
      "Convertimos ideas en aplicaciones móviles intuitivas. Diseñamos cada interacción para crear una experiencia sólida y fácil de usar.",
    image: "/images/serviciomobile.png",
  },
  {
    id: "marketing",
    title: ["Marketing", "digital"],
    subtitle: "Estrategia, campañas y contenidos.",
    description:
      "Conectamos tu marca con las personas adecuadas mediante contenido, campañas y publicidad digital. Medimos resultados para mejorar cada acción.",
    image: "/images/serviciomarketing.png",
  },
  {
    id: "brand",
    title: ["Identidad", "de marca"],
    subtitle: "Identidad visual y dirección de marca.",
    description:
      "Damos forma a tu identidad visual y a tu voz. Un sistema coherente para que tu marca se reconozca en cada punto de contacto.",
    image: "/images/servicioidentidad.png",
  },
  {
    id: "positioning",
    title: ["Posicionamiento"],
    subtitle: "Diferenciación y visibilidad.",
    description:
      "Definimos qué te diferencia y cómo comunicarlo. Trabajamos tu estrategia y presencia en buscadores para acercarte a tus próximos clientes.",
    image: "/images/servicioposicionamiento.png",
  },
];

/* =========================================================
   ICONOS DE SERVICIOS
========================================================= */

function ServiceIcon({ type }: { type: ServiceId }) {
  const gradientId = `service-icon-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke={`url(#${gradientId})`}
      strokeWidth="2.8"
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
          x2="64"
          y2="64"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#c4ecff" />
          <stop offset="42%" stopColor="#258dff" />
          <stop offset="80%" stopColor="#5a63ff" />
          <stop offset="100%" stopColor="#c69cff" />
        </linearGradient>
      </defs>

      {type === "web" && (
        <>
          <circle cx="32" cy="32" r="25" />
          <ellipse cx="32" cy="32" rx="11" ry="25" />
          <path d="M7 32h50" />
          <path d="M11 20h42M11 44h42" />
        </>
      )}

      {type === "mobile" && (
        <>
          <rect
            x="18"
            y="5"
            width="28"
            height="54"
            rx="4"
          />
          <path d="M27 11h10M29 52h6" />
        </>
      )}

      {type === "marketing" && (
        <>
          <path d="M8 54h48" />
          <rect x="10" y="36" width="8" height="18" rx="1" />
          <rect x="24" y="26" width="8" height="28" rx="1" />
          <rect x="38" y="15" width="8" height="39" rx="1" />
          <rect x="52" y="7" width="6" height="47" rx="1" />
        </>
      )}

      {type === "brand" && (
        <>
          <path d="M13 48 9 57l10-4L51 21 43 13 13 48Z" />
          <path d="m38 18 8 8M13 48l6 5" />
          <path d="m43 13 5-5a5 5 0 0 1 7 0l1 1a5 5 0 0 1 0 7l-5 5" />
        </>
      )}

      {type === "positioning" && (
        <>
          <circle cx="30" cy="34" r="24" />
          <circle cx="30" cy="34" r="15" />
          <circle cx="30" cy="34" r="5" />
          <path d="m30 34 23-23" />
          <path d="M45 11h8v8" />
        </>
      )}
    </svg>
  );
}

/* =========================================================
   ICONOS DE NAVEGACION
========================================================= */

function ArrowIcon({ back = false }: { back?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {back ? (
        <path d="M19 12H5m6-6-6 6 6 6" />
      ) : (
        <path d="M5 12h14m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 5 19 19M19 5 5 19" />
    </svg>
  );
}

/* =========================================================
   ILUSTRACIONES PNG
========================================================= */

function ServiceArtwork({
  service,
}: {
  service: Service;
}) {
  return (
    <span className={styles.art} aria-hidden="true">
      <Image
        src={service.image}
        alt=""
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1000px) 55vw, 40vw"
        quality={90}
        className={styles.artImage}
        draggable={false}
      />
    </span>
  );
}

/* =========================================================
   TARJETA CON EFECTO FLIP
========================================================= */

function ServiceCard({
  service,
}: {
  service: Service;
}) {
  const [flipped, setFlipped] = useState(false);
  const descriptionId = useId();

  const name = service.title.join(" ");

  return (
    <button
      type="button"
      className={styles.card}
      data-service={service.id}
      data-flipped={flipped ? "true" : "false"}
      aria-label={`${name}: ${
        flipped ? "ocultar descripción" : "ver descripción"
      }`}
      aria-expanded={flipped}
      aria-controls={descriptionId}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          setFlipped(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          setFlipped(false);
        }
      }}
      onClick={() => {
        setFlipped((current) => !current);
      }}
      onBlur={() => {
        setFlipped(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setFlipped(false);
        }
      }}
    >
      <span className={styles.cardInner}>
        {/* =========================================
            CARA FRONTAL
        ========================================= */}

        <span
          className={`${styles.face} ${styles.front}`}
          aria-hidden={flipped}
        >
          <span
            className={styles.beam}
            aria-hidden="true"
          />

          <ServiceArtwork service={service} />

          <span className={styles.icon}>
            <ServiceIcon type={service.id} />
          </span>

          <span className={styles.cardTitle}>
            {service.title.map((line, index) => (
              <span
                className={styles.titleLine}
                key={`${service.id}-${index}`}
              >
                {index > 0 ? " " : ""}
                {line}
              </span>
            ))}
          </span>

          <span className={styles.subtitle}>
            {service.subtitle}
          </span>

          <span className={styles.action}>
            <span className={styles.actionCircle}>
              <ArrowIcon />
            </span>

            <span className={styles.actionLabel}>
              Explorar
            </span>
          </span>
        </span>

        {/* =========================================
            CARA TRASERA
        ========================================= */}

        <span
          className={`${styles.face} ${styles.back}`}
          aria-hidden={!flipped}
        >
          <span
            className={styles.beam}
            aria-hidden="true"
          />

          <span
            className={styles.backIcon}
            aria-hidden="true"
          >
            <ServiceIcon type={service.id} />
          </span>

          <span className={styles.backTitle}>
            {name}
          </span>

          <span
            id={descriptionId}
            className={styles.description}
          >
            {service.description}
          </span>

          <span className={styles.action}>
            <span className={styles.actionCircle}>
              <span className={styles.backArrow}>
                <ArrowIcon back />
              </span>

              <span className={styles.closeArrow}>
                <CloseIcon />
              </span>
            </span>

            <span className={styles.actionLabel}>
              Volver
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

/* =========================================================
   SECCION SERVICIOS
========================================================= */

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
          <h2
            id={titleId}
            className={styles.heading}
          >
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
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>

        <div className={styles.footer}>
          <span>LUDEN LABS</span>

          <span>
            Pasa el cursor o toca para explorar.
          </span>
        </div>
      </div>
    </section>
  );
}
