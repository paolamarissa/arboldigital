import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bird,
  Bug,
  Clover,
  Flower2,
  Leaf,
  Rabbit,
  Snail,
  Sprout,
  Squirrel,
  TreePine,
  RotateCcw,
  Timer,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const PAIR_DEFS: { icon: LucideIcon; label: string; color: string }[] = [
  { icon: Leaf, label: "Hoja", color: "text-primary" },
  { icon: TreePine, label: "Árbol", color: "text-play-teal" },
  { icon: Rabbit, label: "Conejo", color: "text-play-pink" },
  { icon: Squirrel, label: "Ardilla", color: "text-earth" },
  { icon: Flower2, label: "Flor", color: "text-play-coral" },
  { icon: Bird, label: "Pájaro", color: "text-play-teal" },
  { icon: Bug, label: "Mariquita", color: "text-play-coral" },
  { icon: Snail, label: "Caracol", color: "text-earth" },
  { icon: Sprout, label: "Brote", color: "text-primary" },
  { icon: Clover, label: "Trébol", color: "text-primary" },
];

type Card = {
  id: number;
  pair: number;
  flipped: boolean;
  matched: boolean;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

function buildDeck(): Card[] {
  return shuffle(
    PAIR_DEFS.flatMap((_, pair) => [
      { id: pair * 2, pair, flipped: false, matched: false },
      { id: pair * 2 + 1, pair, flipped: false, matched: false },
    ]),
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(buildDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [pairsFound, setPairsFound] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => {
    if (!running || won) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, won]);

  const restart = useCallback(() => {
    setCards(buildDeck());
    setOpen([]);
    setPairsFound(0);
    setSeconds(0);
    setRunning(false);
    setWon(false);
    lockRef.current = false;
  }, []);

  const flip = (id: number) => {
    if (lockRef.current || won) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    if (!running) setRunning(true);

    const nextOpen = [...open, id];
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setOpen(nextOpen);

    if (nextOpen.length === 2) {
      lockRef.current = true;
      const [a, b] = nextOpen;
      const cardA = cards.find((c) => c.id === a)!;
      const cardB = cards.find((c) => c.id === b)!;
      if (cardA.pair === cardB.pair) {
        setTimeout(() => {
          setCards((cs) =>
            cs.map((c) => (c.pair === cardA.pair ? { ...c, matched: true } : c)),
          );
          setPairsFound((p) => {
            const n = p + 1;
            if (n === PAIR_DEFS.length) setWon(true);
            return n;
          });
          setOpen([]);
          lockRef.current = false;
        }, 500);
      } else {
        setTimeout(() => {
          setCards((cs) =>
            cs.map((c) => (nextOpen.includes(c.id) ? { ...c, flipped: false } : c)),
          );
          setOpen([]);
          lockRef.current = false;
        }, 1000);
      }
    }
  };

  return (
    <div className="relative rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
      {/* Marcador */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
            Pares encontrados: {pairsFound} / {PAIR_DEFS.length}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">
            <Timer className="h-4 w-4" />
            {formatTime(seconds)}
          </span>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Reiniciar Juego
        </button>
      </div>

      {/* Cuadrícula 5x4 */}
      <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-5 sm:gap-4">
        {cards.map((card) => {
          const def = PAIR_DEFS[card.pair]!;
          const Icon = def.icon;
          const visible = card.flipped || card.matched;
          return (
            <button
              key={card.id}
              onClick={() => flip(card.id)}
              aria-label={visible ? def.label : "Carta boca abajo"}
              className="group aspect-square [perspective:600px]"
            >
              <div
                className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  visible ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                {/* Reverso */}
                <div className="absolute inset-0 grid place-items-center rounded-2xl bg-primary shadow-soft transition-colors [backface-visibility:hidden] group-hover:bg-primary/90">
                  <Leaf className="h-1/3 w-1/3 text-primary-foreground/60" />
                </div>
                {/* Frente */}
                <div
                  className={`absolute inset-0 grid place-items-center rounded-2xl border-2 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    card.matched
                      ? "border-accent bg-play-yellow/30"
                      : "border-border bg-cream"
                  }`}
                >
                  <Icon
                    className={`h-1/2 w-1/2 ${def.color} ${
                      card.matched ? "animate-scale-in" : ""
                    }`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal de victoria */}
      {won && (
        <div className="absolute inset-0 z-10 grid place-items-center rounded-3xl bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="mx-4 max-w-sm rounded-3xl border border-border bg-card p-8 text-center shadow-lift animate-scale-in">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/30">
              <Sparkles className="h-8 w-8 text-accent-foreground" />
            </span>
            <h3 className="mt-4 text-xl font-semibold">
              ¡Felicidades! ¡Has encontrado todas las parejas del bosque!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Lo lograste en {formatTime(seconds)}.
            </p>
            <button
              onClick={restart}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              <RotateCcw className="h-4 w-4" />
              Jugar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
