import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getStory } from "@/lib/stories";

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

        <div
          className={`mt-6 grid h-56 place-items-center rounded-3xl border border-border shadow-soft ${story.tone}`}
        >
          <svg
            viewBox="0 0 48 48"
            className="h-20 w-20 text-earth/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <path d="M24 14c-4-3.5-9-4.5-14-4.5v25c5 0 10 1 14 4.5 4-3.5 9-4.5 14-4.5v-25c-5 0-10 1-14 4.5Z" />
            <path d="M24 14v25" />
          </svg>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-1">{story.minutes} min de lectura</span>
          <span className="rounded-full bg-muted px-2.5 py-1">{story.age}</span>
        </div>

        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{story.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{story.text}</p>

        <article className="mt-10 rounded-3xl border border-border bg-card p-7 shadow-soft sm:p-10">
          <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Lectura
          </h2>
          <div className="mt-6 space-y-5 text-[1.0625rem] leading-8">
            {story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-10 text-center text-sm font-semibold text-primary">Fin</p>
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
