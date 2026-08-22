import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/manualidades")({
  head: () => ({
    meta: [
      { title: "Rincón de Manualidades — El Árbol Digital" },
      {
        name: "description",
        content: "Ideas sencillas para crear con papel, hojas y colores en casa.",
      },
      { property: "og:title", content: "Rincón de Manualidades" },
      { property: "og:description", content: "Ideas sencillas para crear con las manos." },
    ],
  }),
  component: Manualidades,
});

const crafts = [
  { title: "Hojas estampadas", text: "Pinta hojas del jardín y estámpalas en papel." },
  { title: "Árbol de cartón", text: "Recorta y arma un árbol que se sostiene solo." },
];

function Manualidades() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Manualidades
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Rincón de Manualidades</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Actividades para hacer con materiales que ya están en casa.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {crafts.map((c) => (
            <article
              key={c.title}
              className="rounded-3xl border border-border bg-card p-7 shadow-soft"
            >
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
