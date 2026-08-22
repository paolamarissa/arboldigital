import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/juegos")({
  head: () => ({
    meta: [
      { title: "Zona de Juegos — El Árbol Digital" },
      {
        name: "description",
        content: "Minijuegos tranquilos para observar, recordar y resolver, pensados para niños.",
      },
      { property: "og:title", content: "Zona de Juegos" },
      { property: "og:description", content: "Minijuegos tranquilos para niñas y niños." },
    ],
  }),
  component: Juegos,
});

const games = [
  { title: "Memoria del bosque", text: "Encuentra las parejas de hojas.", ready: true },
  { title: "Rompecabezas del árbol", text: "Arma la ilustración pieza a pieza.", ready: false },
  { title: "Cuenta las semillas", text: "Números del 1 al 10 jugando.", ready: false },
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
          Este es el espacio donde vivirán los minijuegos. El tablero de abajo está listo para
          recibir el primero.
        </p>

        <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center shadow-soft">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="h-8 w-8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <path d="M7 7h7a2.5 2.5 0 1 1 4 0h7v7a2.5 2.5 0 1 0 0 4v7h-7a2.5 2.5 0 1 0-4 0H7v-7a2.5 2.5 0 1 1 0-4V7Z" />
            </svg>
          </span>
          <h2 className="mt-6 text-lg font-semibold">Tablero de juego</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Aquí se cargará el minijuego seleccionado.
          </p>
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
                {g.ready ? "Disponible pronto" : "En preparación"}
              </span>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
