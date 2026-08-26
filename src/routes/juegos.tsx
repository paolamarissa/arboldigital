import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { GlupGame } from "@/components/GlupGame";
import { MultiplicationGame } from "@/components/MultiplicationGame";

export const Route = createFileRoute("/juegos")({
  head: () => ({
    meta: [
      { title: "Zona de Juegos — El Árbol Digital" },
      {
        name: "description",
        content:
          "Juega con Glup, el monstruo de las palabras: escucha, elige la palabra correcta y sube de nivel.",
      },
      { property: "og:title", content: "Zona de Juegos — El Árbol Digital" },
      {
        property: "og:description",
        content: "Glup, el monstruo de las palabras: un juego de escucha y lectura para niños.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Juegos,
});

const games = [
  { title: "Glup, el monstruo de las palabras", text: "Escucha y dale la palabra correcta.", ready: true },
  { title: "Memoria del bosque", text: "Encuentra las parejas de hojas.", ready: false },
  { title: "Rompecabezas del árbol", text: "Arma la ilustración pieza a pieza.", ready: false },
];

function Juegos() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Juegos
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Zona de Juegos</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Hoy juega con Glup, el monstruo de las palabras: escucha qué palabra quiere comer y
          dásela. Cada nivel trae palabras un poco más largas.
        </p>

        <div className="mt-10">
          <GlupGame />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {games.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <h3 className="text-sm font-semibold">{g.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{g.text}</p>
              <span className="mt-4 inline-block rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                {g.ready ? "Disponible ahora" : "En preparación"}
              </span>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

