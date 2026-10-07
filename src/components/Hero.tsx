import Image from "next/image";

import HeroSphere from "./HeroSphere";
import ScreenGlitch from "./ScreenGlitch";

import styles from "./Hero.module.css";
import layout from "./HeroLayout.module.css";

const TITLE_LINES = [
  { text: "Creamos", tone: "metal" },
  { text: "experiencias", tone: "metal" },
  { text: "digitales que", tone: "color" },
  { text: "destacan.", tone: "color" },
] as const;

function ArrowIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroActions({
  className,
}: {
  className: string;
}) {
  return (
    <div className={className}>
      <button
        type="button"
        disabled
        className={`${styles.button} ${styles.primary}`}
      >
        <span>Comencemos un proyecto</span>
        <ArrowIcon />
      </button>

      <button
        type="button"
        disabled
        className={`${styles.button} ${styles.secondary}`}
      >
        <span>Ver proyectos</span>
        <ArrowIcon />
      </button>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="luden-hero"
    >
      <div
        className={`hero-background ${layout.desktopBackground}`}
        aria-hidden="true"
      >
        <Image
          src="/images/fondoluden.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="hero-background-image"
        />
      </div>

      <div
        className="hero-shade"
        aria-hidden="true"
      />

      <div
        className="hero-bottom-fade"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-svh max-w-[1440px] items-center gap-5 px-5 pb-12 pt-32 sm:px-8 sm:pt-36 lg:grid-cols-[1.08fr_1fr] lg:gap-0 lg:px-12 lg:pb-28 lg:pt-40">
        <div className="hero-enter relative z-10 max-w-[700px]">
          <p className="mb-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-display text-xs font-medium tracking-[0.18em] text-[#a8c9ff] sm:mb-8 sm:gap-x-4">
            <span>IDEAS</span>

            <span
              aria-hidden="true"
              className="text-[#7865ad]"
            >
              ×
            </span>

            <span>TECNOLOGÍA</span>

            <span
              aria-hidden="true"
              className="text-[#7865ad]"
            >
              ×
            </span>

            <span>IMPACTO</span>
          </p>

          <h1
            id="hero-title"
            aria-label="Creamos experiencias digitales que destacan."
            className={`${styles.title} font-display text-[clamp(1.8rem,7.1vw,3.6rem)] font-extrabold leading-[1.17] tracking-[-0.045em] uppercase lg:text-[clamp(2.6rem,4.15vw,4.6rem)]`}
          >
            {TITLE_LINES.map(({ text, tone }) => (
              <span
                key={text}
                className={`${styles.line} ${styles[tone]}`}
              >
                <span className={styles.fill}>
                  {text}
                </span>

                <span
                  aria-hidden="true"
                  className={styles.outline}
                  data-text={text}
                />
              </span>
            ))}
          </h1>

          <p className="mt-7 max-w-[470px] text-base leading-[1.85] text-[#c0cce4] sm:mt-8 sm:text-lg">
            En Luden Labs combinamos diseño, desarrollo y estrategia
            para transformar tus ideas en experiencias digitales
            con identidad propia.
          </p>

          <HeroActions
            className={layout.desktopActions}
          />
        </div>

        <div className={layout.visual}>
          <div
            className={layout.mobileBackground}
            aria-hidden="true"
          >
            <Image
              src="/images/fondoluden.png"
              alt=""
              fill
              loading="eager"
              sizes="100vw"
              className={layout.mobileBackgroundImage}
            />
          </div>

          <div className={layout.sphere}>
            <HeroSphere />
          </div>
        </div>

        <HeroActions
          className={layout.mobileActions}
        />
      </div>

      <ScreenGlitch />
    </section>
  );
}