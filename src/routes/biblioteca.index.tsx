import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpenText, Sprout, Waves, type LucideIcon } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { stories } from "@/lib/stories";

const storyIcons: Record<string, LucideIcon> = {
  "la-semilla-que-no-queria-dormir": Sprout,
  "el-rio-de-los-mil-colores": Waves,
};

export const Route = createFileRoute("/biblioteca/")({
  head: () => ({
    meta: [
      { title: "Biblioteca de Cuentos — El Árbol Digital" },
      {
        name: "description",
        content: "Cuentos cortos ilustrados para leer en familia, con calma y en voz alta.",
      },
      { property: "og:title", content: "Biblioteca de Cuentos" },
      {
        property: "og:description",
        content: "Cuentos cortos ilustrados para leer en familia.",
      },
    ],
  }),
  component: Biblioteca,
});

function Biblioteca() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Biblioteca
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Biblioteca de Cuentos</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Historias breves para leer antes de dormir. Cada cuento indica su duración aproximada y
          la edad sugerida.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {stories.map((s) => {
            const Icon = storyIcons[s.slug] ?? BookOpenText;
            return (
              <article
                key={s.title}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className={`grid h-40 place-items-center ${s.tone}`}>
                  <Icon className="h-16 w-16 text-earth/70" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-muted-foreground">
                    <span className="rounded-full bg-muted px-2.5 py-1">{s.minutes} min</span>
                    <span className="rounded-full bg-muted px-2.5 py-1">{s.age}</span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                  <Link
                    to="/biblioteca/$slug"
                    params={{ slug: s.slug }}
                    className="mt-5 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Leer cuento
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
