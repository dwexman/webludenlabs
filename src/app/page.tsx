import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black focus:translate-y-0"
      >
        Ir al contenido
      </a>

      <Navbar />

      <main id="contenido">
        <Hero />
      </main>
    </>
  );
}