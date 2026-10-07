import type { Metadata } from "next";
import { Manrope, Orbitron } from "next/font/google";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luden Labs | Diseño, desarrollo y experiencias digitales",

  description:
    "Creamos sitios web, aplicaciones y experiencias digitales que conectan diseño, tecnología y estrategia.",

  icons: {
    icon: "/images/logomientras.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${orbitron.variable}`}
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}