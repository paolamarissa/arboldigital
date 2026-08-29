import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import arbolAsset from "@/assets/arbol digital.png";

const arbol = arbolAsset.url;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "El Árbol Digital — cuentos, juegos y manualidades" },
      {
        name: "description",
        content:
          "Un rincón digital tranquilo para niñas y niños: biblioteca de cuentos, zona de juegos y manualidades.",
      },
      { property: "og:title", content: "El Árbol Digital" },
      {
        property: "og:description",
        content: "Cuentos, juegos y manualidades para crecer con calma.",
      },
    ],
  }),
  component: Index,
});

const cards = [
  {
    to: "/biblioteca",
    title: "Biblioteca de Cuentos",
    text: "Historias cortas para leer juntos antes de dormir.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 9c-3-2.5-6-3-9-3v17c3 0 6 .5 9 3 3-2.5 6-3 9-3V6c-3 0-6 .5-9 3Z" />
        <path d="M16 9v17" />
      </svg>
    ),
  },
  {
    to: "/juegos",
    title: "Zona de Juegos",
    text: "Minijuegos sencillos para pensar y descubrir.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7h7a2.5 2.5 0 1 1 4 0h7v7a2.5 2.5 0 1 0 0 4v7h-7a2.5 2.5 0 1 0-4 0H7v-7a2.5 2.5 0 1 1 0-4V7Z" />
      </svg>
    ),
  },
  {
    to: "/manualidades",
    title: "Rincón de Manualidades",
    text: "Ideas para crear con papel, tijeras y color.",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4l8 8-11 11-8-8L20 4Z" />
        <path d="M9 15l-3 7a2 2 0 0 0 2.6 2.6l7-3" />
      </svg>
    ),
  },
] as const;

function Index() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <main>
        <section className="mx-auto max-w-3xl px-6 pt-16 pb-4 text-center">
          <img
            src={arbol}
            alt="Ilustración de un árbol colorido con flores, pájaros, un libro, un pincel y una nube con una bombilla"
            width={1536}
            height={1920}
            className="mx-auto w-full max-w-md"
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Bienvenidos
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-semibold sm:text-5xl">
            El Árbol Digital
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Un lugar con calma para leer cuentos, jugar un rato y crear cosas con las manos.
          </p>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-6 py-14 sm:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                {c.icon}
              </span>
              <h2 className="mt-6 text-lg font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            </Link>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
