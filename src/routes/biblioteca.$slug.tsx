import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookOpenText, Clock, Sprout, Users, Waves, type LucideIcon } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getStory } from "@/lib/stories";

const storyIcons: Record<string, LucideIcon> = {
  "la-semilla-que-no-queria-dormir": Sprout,
  "el-rio-de-los-mil-colores": Waves,
};

export const Route = createFileRoute("/biblioteca/$slug")({
  loader: ({ params }) => {
    const story = getStory(params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Cuento no encontrado — El Árbol Digital" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { story } = loaderData;
    const title = `${story.title} — El Árbol Digital`;
    return {
      meta: [
        { title },
        { name: "description", content: story.text },
        { property: "og:title", content: story.title },
        { property: "og:description", content: story.text },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: CuentoNoEncontrado,
  component: CuentoDetalle,
});

function CuentoNoEncontrado() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pt-20 text-center">
        <h1 className="text-3xl font-semibold">Este cuento se fue de paseo</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          No encontramos la historia que buscas.
        </p>
        <Link
          to="/biblioteca"
          className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Volver a la biblioteca
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function CuentoDetalle() {
  const { story } = Route.useLoaderData();
  const Icon = storyIcons[story.slug] ?? BookOpenText;

  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 pt-14">
        <Link
          to="/biblioteca"
          className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Biblioteca
        </Link>

        {/* Portada */}
        <div
          className={`relative mt-6 grid h-56 place-items-center overflow-hidden rounded-3xl border border-border shadow-soft sm:h-64 ${story.tone}`}
        >
          <div className="absolute left-6 top-6 h-10 w-10 rounded-full bg-accent/50" />
          <div className="absolute bottom-6 right-8 h-6 w-6 rounded-full bg-accent/40" />
          <div className="absolute right-10 top-8 h-4 w-4 rounded-full bg-earth/20" />
          <Icon className="h-24 w-24 text-earth/70" strokeWidth={1.4} aria-hidden />
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {story.minutes} min de lectura
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {story.age}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{story.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{story.text}</p>

        {/* Lectura estilo libro digital */}
        <article className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-12">
          <div className="flex items-center gap-3">
            <BookOpenText className="h-4 w-4 text-primary" aria-hidden />
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Lectura
            </h2>
          </div>

          <div className="mt-8 space-y-7 text-[1.125rem] leading-9 text-foreground/90 sm:text-lg sm:leading-9">
            {story.paragraphs.map((p, i) =>
              i === 0 ? (
                <p
                  key={p}
                  className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-primary"
                >
                  {p}
                </p>
              ) : (
                <p key={p}>{p}</p>
              ),
            )}
          </div>

          {/* Ornamento y final */}
          <div className="mt-12 flex items-center justify-center gap-3 text-earth/50" aria-hidden>
            <span className="h-px w-14 bg-border" />
            <Icon className="h-6 w-6" strokeWidth={1.6} />
            <span className="h-px w-14 bg-border" />
          </div>
          <p className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Fin
          </p>
        </article>

        <Link
          to="/biblioteca"
          className="mt-8 mb-4 inline-block rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          Elegir otro cuento
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
