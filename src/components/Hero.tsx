
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import HeroSphere from "./HeroSphere";
import ScreenGlitch, {
  type HeroTheme,
  type ScreenGlitchHandle,
} from "./ScreenGlitch";
import styles from "./Hero.module.css";
import layout from "./HeroLayout.module.css";

function ArrowIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function HeroActions({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.actions} ${className}`}>
      <button type="button" disabled className={`${styles.button} ${styles.primary}`}>
        <span>Comencemos un proyecto</span>
        <ArrowIcon />
      </button>

      <button type="button" disabled className={`${styles.button} ${styles.secondary}`}>
        <span>Ver proyectos</span>
        <ArrowIcon />
      </button>
    </div>
  );
}

function ThemeSwitch({
  theme,
  onChange,
}: {
  theme: HeroTheme;
  onChange: (theme: HeroTheme) => void;
}) {
  return (
    <div className={layout.themeSwitch} role="group" aria-label="Estilo visual del hero">
      <span className={layout.switchLabel}>Explora nuestros estilos</span>

      {(["cyber", "editorial"] as const).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          onClick={() => onChange(value)}
        >
          {value === "cyber" ? "Cyber" : "Editorial"}
        </button>
      ))}
    </div>
  );
}

function CyberHero() {
  return (
    <div className={layout.cyberShell}>
      <div className={layout.cyberBackground} aria-hidden="true">
        <Image
          src="/images/fondoluden.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className={layout.cyberBackgroundImage}
        />
      </div>

      <div className={layout.cyberShade} aria-hidden="true" />
      <div className={layout.cyberBottomFade} aria-hidden="true" />

      <div className={layout.cyberContainer}>
        <div className={`${layout.cyberCopy} hero-enter`}>
          <p className={`${styles.eyebrow} font-display`}>
            <span>IDEAS</span>
            <span aria-hidden="true">×</span>
            <span>TECNOLOGÍA</span>
            <span aria-hidden="true">×</span>
            <span>IMPACTO</span>
          </p>

          <h1
            id="hero-title"
            aria-label="Creamos experiencias digitales que destacan."
            className={`${styles.cyberTitle} font-display`}
          >
            <span className={`${styles.cyberLine} ${styles.metal}`}>
              <span className={styles.cyberFill}>Creamos</span>
              <span aria-hidden="true" className={styles.cyberOutline} data-text="Creamos" />
            </span>

            <span className={`${styles.cyberLine} ${styles.metal}`}>
              <span className={styles.cyberFill}>experiencias</span>
              <span aria-hidden="true" className={styles.cyberOutline} data-text="experiencias" />
            </span>

            <span className={`${styles.cyberLine} ${styles.color}`}>
              <span className={styles.cyberFill}>digitales que</span>
              <span aria-hidden="true" className={styles.cyberOutline} data-text="digitales que" />
            </span>

            <span className={`${styles.cyberLine} ${styles.color}`}>
              <span className={styles.cyberFill}>destacan.</span>
              <span aria-hidden="true" className={styles.cyberOutline} data-text="destacan." />
            </span>
          </h1>

          <p className={styles.cyberDescription}>
            En Luden Labs combinamos diseño, desarrollo y estrategia para transformar tus ideas
            en experiencias digitales con identidad propia.
          </p>

          <HeroActions className={layout.cyberDesktopActions} />
        </div>

        <div className={layout.cyberVisual}>
          <div className={layout.cyberMobileBackground} aria-hidden="true">
            <Image
              src="/images/fondoluden.png"
              alt=""
              fill
              sizes="100vw"
              className={layout.cyberMobileBackgroundImage}
            />
          </div>

          <div className={layout.cyberSphere}>
            <HeroSphere theme="cyber" />
          </div>
        </div>

        <HeroActions className={layout.cyberMobileActions} />
      </div>
    </div>
  );
}

function EditorialHero() {
  return (
    <div className={layout.editorialShell}>
      <div className={layout.editorialPaperNoise} aria-hidden="true" />

      <div className={layout.editorialContainer}>
        <div className={layout.editorialCopy}>
          <div className={styles.editorialKicker}>
            <span>LUDEN LABS</span>
            <span className={styles.editorialRule} aria-hidden="true" />
            <span>ESTUDIO DIGITAL</span>
          </div>

          <h1
            id="hero-title"
            aria-label="Creamos experiencias digitales que destacan."
            className={styles.editorialTitle}
          >
            <span>Creamos</span>
            <span>experiencias</span>
            <span className={styles.editorialAccent}>digitales</span>
            <span>que destacan.</span>
          </h1>

          <div className={styles.editorialBodyRow}>
            <p className={styles.editorialIndex}>01</p>
            <p className={styles.editorialDescription}>
              Diseño, desarrollo y estrategia para convertir ideas en productos digitales claros,
              memorables y con una identidad propia.
            </p>
          </div>

          <HeroActions className={layout.editorialActions} />
        </div>

        <div className={layout.editorialVisual} aria-label="Identidad visual Luden Labs">
          <div className={layout.editorialFrame} aria-hidden="true">
            <div className={layout.editorialFrameTop}>
              <span>DESIGN / CODE / STRATEGY</span>
              <span>2026</span>
            </div>

            <div className={layout.editorialAxisX} />
            <div className={layout.editorialAxisY} />

            <div className={layout.editorialSphere}>
              <HeroSphere theme="editorial" />
            </div>

            <div className={layout.editorialCaption}>
              <span>DIGITAL EXPERIENCES</span>
              <span>SANTIAGO — CHILE</span>
            </div>
          </div>

          <div className={layout.editorialSideLabel} aria-hidden="true">
            LUDEN / LABS
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [theme, setTheme] = useState<HeroTheme>("cyber");
  const glitchRef = useRef<ScreenGlitchHandle>(null);

  // Mantiene el navbar sincronizado con el diseño mostrado por el hero.
  useEffect(() => {
    document.documentElement.dataset.ludenTheme = theme;
    window.dispatchEvent(new CustomEvent("luden:theme-change", { detail: theme }));
  }, [theme]);

  const changeTheme = (nextTheme: HeroTheme) => {
    if (nextTheme === theme) return;
    glitchRef.current?.transitionTo(nextTheme);
  };

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className={styles.hero}
      data-theme={theme}
    >
      {theme === "cyber" ? <CyberHero /> : <EditorialHero />}

      <ThemeSwitch theme={theme} onChange={changeTheme} />

      <ScreenGlitch ref={glitchRef} theme={theme} onThemeChange={setTheme} />
    </section>
  );
}
