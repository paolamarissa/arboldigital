import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  ChevronDown,
  Leaf,
  Scissors,
  Palette,
  Paintbrush,
  Trees,
  Sparkles,
  Clock,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/manualidades")({
  head: () => ({
    meta: [
      { title: "Rincón de Manualidades — El Árbol Digital" },
      {
        name: "description",
        content:
          "Proyectos paso a paso para crear con las manos: hojas estampadas y árbol de cartón, con materiales y pasos marcables para niños.",
      },
      { property: "og:title", content: "Rincón de Manualidades" },
      {
        property: "og:description",
        content: "Proyectos paso a paso para crear con las manos.",
      },
    ],
  }),
  component: Manualidades,
});

type Craft = {
  id: string;
  title: string;
  text: string;
  icon: LucideIcon;
  tone: string;
  chipTone: string;
  time: string;
  age: string;
  materials: { icon: LucideIcon; label: string }[];
  steps: string[];
};

const crafts: Craft[] = [
  {
    id: "hojas-estampadas",
    title: "Hojas estampadas",
    text: "Pinta hojas del jardín y estámpalas en papel para crear un cuadro del bosque.",
    icon: Leaf,
    tone: "bg-secondary",
    chipTone: "bg-secondary text-secondary-foreground",
    time: "30 min",
    age: "4+ años",
    materials: [
      { icon: Leaf, label: "Hojas grandes del jardín o del parque" },
      { icon: Paintbrush, label: "Pinceles (uno ancho y uno fino)" },
      { icon: Palette, label: "Pintura lavable de colores" },
      { icon: Scissors, label: "Hojas de papel blanco o cartulina" },
      { icon: Sparkles, label: "Un plato viejo para la pintura" },
    ],
    steps: [
      "Busca hojas grandes y bonitas en el jardín. ¡Cuanto más rara la forma, mejor!",
      "Pon un poco de pintura en el plato viejo. No demasiada, como una cucharada.",
      "Pinta una hoja por la parte de las venas (las rayitas) con el pincel ancho.",
      "Coloca la hoja pintada sobre el papel, como si fuera a dormir una siesta.",
      "Aprieta suavecito con las manos por todo el papel. ¡Uno, dos y tres!",
      "Levanta la hoja despacito, por la punta del tallo… ¡sorpresa! Apareció el estampado.",
      "Repite con más hojas y colores hasta llenar tu cuadro del bosque.",
    ],
  },
  {
    id: "arbol-de-carton",
    title: "Árbol de cartón",
    text: "Recorta y arma un árbol que se sostiene solo para decorar tu cuarto.",
    icon: Trees,
    tone: "bg-cream",
    chipTone: "bg-accent text-accent-foreground",
    time: "45 min",
    age: "6+ años",
    materials: [
      { icon: Scissors, label: "Cartón (una caja vieja sirve perfecto)" },
      { icon: Scissors, label: "Tijeras de punta redonda (pide ayuda a un adulto)" },
      { icon: Paintbrush, label: "Colores, crayones o pintura" },
      { icon: Sparkles, label: "Pegamento en barra" },
      { icon: Leaf, label: "Opcional: hojas de papel de colores" },
    ],
    steps: [
      "Dibuja en el cartón la forma de un árbol: un tronco grueso con ramas, dos veces igual.",
      "Pídele a un adulto que te ayude a recortar las dos piezas del árbol.",
      "Haz una ranura en el centro de cada pieza: una de arriba hacia abajo y otra de abajo hacia arriba.",
      "Pinta las dos piezas: el tronco color tierra y las ramas con tonos verdes.",
      "Deja secar la pintura un ratito. ¡Es hora de un vaso de agua!",
      "Encaja las dos piezas por las ranuras, como un rompecabezas de dos piezas.",
      "Pega hojitas de papel de colores en las ramas y… ¡tu árbol ya se sostiene solo!",
    ],
  },
];

function CraftCard({ craft }: { craft: Craft }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<boolean[]>(() => craft.steps.map(() => false));
  const completed = done.filter(Boolean).length;
  const Icon = craft.icon;

  const toggleStep = (i: number) =>
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
      {/* Cabecera de la tarjeta */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={`craft-${craft.id}`}
        className="flex w-full items-center gap-5 p-6 text-left transition-colors hover:bg-muted/40 sm:p-8"
      >
        <span
          className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${craft.tone}`}
        >
          <Icon className="h-8 w-8 text-earth/70" strokeWidth={1.6} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold sm:text-2xl">{craft.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{craft.text}</p>
          <span className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {craft.time}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
              <Users className="h-3.5 w-3.5" aria-hidden /> {craft.age}
            </span>
            {completed > 0 && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${craft.chipTone}`}>
                <Check className="h-3.5 w-3.5" aria-hidden />
                {completed}/{craft.steps.length} pasos
              </span>
            )}
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {/* Contenido desplegable */}
      {open && (
        <div id={`craft-${craft.id}`} className="border-t border-border px-6 pb-8 pt-6 sm:px-8">
          {/* Materiales */}
          <div className={`rounded-2xl p-5 sm:p-6 ${craft.tone}`}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-earth/80">
              Materiales
            </h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {craft.materials.map((m) => (
                <li key={m.label} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-card">
                    <m.icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                  </span>
                  {m.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Pasos */}
          <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Pasos a seguir
          </h3>
          <ol className="mt-4 space-y-3">
            {craft.steps.map((step, i) => {
              const isDone = done[i];
              return (
                <li key={step}>
                  <button
                    type="button"
                    onClick={() => toggleStep(i)}
                    aria-pressed={isDone}
                    className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${
                      isDone
                        ? "border-primary/40 bg-secondary/60"
                        : "border-border bg-card hover:border-primary/30 hover:bg-muted/40"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors ${
                        isDone
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                      aria-hidden
                    >
                      {isDone ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span
                      className={`pt-1 text-sm leading-relaxed transition-colors ${
                        isDone ? "text-muted-foreground line-through" : "text-foreground/85"
                      }`}
                    >
                      {step}
                    </span>
                    <span
                      className={`ml-auto mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                        isDone ? "border-primary bg-primary" : "border-border bg-card"
                      }`}
                      aria-hidden
                    >
                      {isDone && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {completed === craft.steps.length && (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-accent/50 px-5 py-4 text-center">
              <Sparkles className="h-5 w-5 text-accent-foreground" aria-hidden />
              <p className="text-sm font-semibold text-accent-foreground">
                ¡Lo lograste! Tu {craft.title.toLowerCase()} está terminado.
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

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
          Actividades para hacer con materiales que ya están en casa. Toca una tarjeta para
          ver los materiales y marca cada paso cuando lo termines.
        </p>

        <div className="mt-10 grid gap-6">
          {crafts.map((c) => (
            <CraftCard key={c.id} craft={c} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
