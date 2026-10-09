"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Theme = "cyber" | "editorial";

const navigation = [
  { label: "Inicio", href: "#inicio", enabled: true },
  { label: "Servicios", href: "#servicios", enabled: false },
  { label: "Proyectos", href: "#proyectos", enabled: false },
  { label: "Nosotros", href: "#nosotros", enabled: false },
];

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("cyber");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 20);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const syncTheme = () => {
      setTheme(document.documentElement.dataset.ludenTheme === "editorial" ? "editorial" : "cyber");
    };
    syncTheme();
    window.addEventListener("luden:theme-change", syncTheme);
    return () => window.removeEventListener("luden:theme-change", syncTheme);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const editorial = theme === "editorial";
  const headerColors = editorial
    ? scrolled || menuOpen
      ? "border-[#c9c2b9] bg-[#f5f1e9]/95 backdrop-blur-xl"
      : "border-[#d7d0c8] bg-[#f5f1e9]/92 backdrop-blur-sm"
    : scrolled || menuOpen
      ? "border-blue-300/15 bg-[#02040b]/95 backdrop-blur-xl"
      : "border-white/10 bg-black/25 backdrop-blur-sm";

  const cta = editorial
    ? "inline-flex items-center justify-center gap-4 rounded-none border border-[#39333c] bg-[#39333c] px-7 py-3 text-sm font-semibold text-[#f8f5ef] transition-colors hover:bg-[#62536b] disabled:cursor-default"
    : "neon-button";

  return (
    <header
      data-navbar-theme={theme}
      className={["fixed inset-x-0 top-0 z-50", "border-b transition-colors duration-300", headerColors].join(" ")}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:h-24 lg:px-12">
        <Link
          href="#inicio"
          onClick={() => setMenuOpen(false)}
          aria-label="Luden Labs, inicio"
          className="flex shrink-0 items-center gap-2 sm:gap-3"
        >
          {editorial ? (
            <div className="flex items-baseline gap-2 text-[#2b2830]">
              <span className="font-serif text-[26px] font-semibold tracking-[-0.06em] sm:text-[32px]">Luden</span>
              <span className="font-serif text-[26px] italic tracking-[-0.06em] text-[#93829d] sm:text-[32px]">Labs.</span>
            </div>
          ) : (
            <>
              <Image
                src="/images/logomientras.png"
                alt=""
                width={56}
                height={56}
                loading="eager"
                className="h-11 w-11 object-contain sm:h-14 sm:w-14"
              />
              <span className="font-display text-sm font-semibold tracking-[0.1em] sm:text-lg">
                <span className="text-[#8cd5ff]">LUDEN</span>{" "}
                <span className="text-[#b475ff]">LABS</span>
              </span>
            </>
          )}
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 lg:flex xl:gap-10">
          {navigation.map((item) =>
            item.enabled ? (
              <Link
                key={item.label}
                href={item.href}
                aria-current="page"
                className={editorial
                  ? "border-b border-[#413847] py-2 text-sm font-semibold text-[#28252c]"
                  : "navbar-active py-2 text-sm font-semibold text-white"}
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                aria-disabled="true"
                className={editorial
                  ? "cursor-default py-2 text-sm font-medium text-[#777078]"
                  : "cursor-default py-2 text-sm font-medium text-[#b9c5e1]"}
              >
                {item.label}
              </span>
            ),
          )}
        </nav>

        <div className="hidden lg:block">
          <button type="button" disabled className={cta}>
            Hablemos <ArrowIcon />
          </button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className={editorial
            ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-none border border-[#b5acb3] bg-[#ebe5dc] text-[#302a34] lg:hidden"
            : "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-300/25 bg-blue-950/20 text-white lg:hidden"}
        >
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d={menuOpen ? "M6 6l12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"}
              stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div
        id="mobile-navigation"
        hidden={!menuOpen}
        className={editorial
          ? "border-t border-[#d7d0c8] bg-[#f5f1e9] lg:hidden"
          : "border-t border-white/10 bg-[#040817] lg:hidden"}
      >
        <nav aria-label="Navegación móvil" className="mx-auto flex max-w-[1440px] flex-col px-5 py-5 sm:px-8">
          {navigation.map((item) =>
            item.enabled ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current="page"
                className={editorial
                  ? "rounded-none px-3 py-3 text-base font-semibold text-[#342b39]"
                  : "rounded-lg px-3 py-3 text-base font-semibold text-[#79ccff]"}
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                aria-disabled="true"
                className={editorial
                  ? "cursor-default px-3 py-3 text-base text-[#777078]"
                  : "cursor-default rounded-lg px-3 py-3 text-base text-[#b9c5e1]"}
              >
                {item.label}
              </span>
            ),
          )}
          <button type="button" disabled className={`${cta} mt-4 self-start`}>
            Hablemos <ArrowIcon />
          </button>
        </nav>
      </div>
    </header>
  );
}
