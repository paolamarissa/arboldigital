import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LevelKey = "easy" | "medium" | "hard";

type Level = {
  key: LevelKey;
  name: string;
  emoji: string;
  desc: string;
  tag: string;
  min: number;
  max: number;
  minB: number;
  maxB: number;
  questions: number;
  spread: number;
  accent: string;
};

const LEVELS: Level[] = [
  {
    key: "easy",
    name: "Luna",
    emoji: "🌕",
    desc: "Tablas del 1 al 5. La más cercana.",
    tag: "Fácil",
    min: 1,
    max: 5,
    minB: 1,
    maxB: 10,
    questions: 10,
    spread: 5,
    accent: "bg-play-teal/15 text-play-teal",
  },
  {
    key: "medium",
    name: "Marte",
    emoji: "🪐",
    desc: "Tablas del 2 al 9. Un poco más lejos.",
    tag: "Medio",
    min: 2,
    max: 9,
    minB: 2,
    maxB: 9,
    questions: 12,
    spread: 12,
    accent: "bg-accent/20 text-earth",
  },
  {
    key: "hard",
    name: "Júpiter",
    emoji: "✨",
    desc: "Tablas del 6 al 12. ¡El planeta gigante!",
    tag: "Difícil",
    min: 6,
    max: 12,
    minB: 6,
    maxB: 12,
    questions: 15,
    spread: 20,
    accent: "bg-play-pink/15 text-play-pink",
  },
];

type Question = { a: number; b: number; answer: number };

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function buildQuestions(cfg: Level): Question[] {
  const qs: Question[] = [];
  const seen = new Set<string>();
  while (qs.length < cfg.questions) {
    const a = rand(cfg.min, cfg.max);
    const b = rand(cfg.minB, cfg.maxB);
    const key = [a, b].sort((x, y) => x - y).join("x");
    if (seen.has(key) && qs.length < cfg.questions - 2) continue;
    seen.add(key);
    qs.push({ a, b, answer: a * b });
  }
  return qs;
}

function buildChoices(correct: number, spread: number): number[] {
  const set = new Set<number>([correct]);
  while (set.size < 4) {
    const delta = rand(1, spread);
    const sign = Math.random() < 0.5 ? -1 : 1;
    let val = correct + sign * delta;
    if (val < 0) val = correct + delta;
    if (val === correct) continue;
    set.add(val);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

const MAX_LIVES = 3;

export function MultiplicationGame() {
  const [screen, setScreen] = useState<"select" | "game" | "result">("select");
  const [level, setLevel] = useState<Level>(LEVELS[0]!);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [choices, setChoices] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [chosen, setChosen] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [completed, setCompleted] = useState(true);

  const answered = useRef(false);

  const startLevel = useCallback((cfg: Level) => {
    const qs = buildQuestions(cfg);
    answered.current = false;
    setLevel(cfg);
    setQuestions(qs);
    setChoices(buildChoices(qs[0]!.answer, cfg.spread));
    setIndex(0);
    setCorrectCount(0);
    setScore(0);
    setLives(MAX_LIVES);
    setChosen(null);
    setFeedback(null);
    setScreen("game");
  }, []);

  const handleAnswer = (val: number) => {
    if (answered.current) return;
    answered.current = true;
    const q = questions[index]!;
    const ok = val === q.answer;
    setChosen(val);
    const nextLives = ok ? lives : lives - 1;
    const nextCorrect = ok ? correctCount + 1 : correctCount;
    if (ok) {
      setScore((s) => s + 10);
      setCorrectCount(nextCorrect);
      setFeedback({ text: "¡Correcto! 🎉", ok: true });
    } else {
      setLives(nextLives);
      setFeedback({ text: "Casi. ¡Sigue intentando!", ok: false });
    }

    setTimeout(() => {
      if (nextLives <= 0) {
        setCompleted(false);
        setScreen("result");
        return;
      }
      const nextIdx = index + 1;
      if (nextIdx >= questions.length) {
        setCompleted(true);
        setScreen("result");
        return;
      }
      answered.current = false;
      setIndex(nextIdx);
      setChoices(buildChoices(questions[nextIdx]!.answer, level.spread));
      setChosen(null);
      setFeedback(null);
    }, 900);
  };

  if (screen === "select") {
    return (
      <div className="rounded-3xl border border-border bg-card px-5 py-10 shadow-soft sm:px-8">
        <div className="text-center">
          <div className="text-4xl" aria-hidden>
            🚀
          </div>
          <h2 className="mt-3 font-display text-2xl font-semibold">Misión Multiplicación</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Elige un planeta y despega a resolver.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-xl gap-4">
          {LEVELS.map((cfg) => (
            <button
              key={cfg.key}
              type="button"
              onClick={() => startLevel(cfg)}
              className="flex items-center gap-4 rounded-2xl border border-border bg-background p-4 text-left shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span
                aria-hidden
                className="grid h-14 w-14 flex-none place-items-center rounded-full bg-secondary text-3xl"
              >
                {cfg.emoji}
              </span>
              <span className="flex-1">
                <span className="block font-display text-lg font-semibold">{cfg.name}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {cfg.desc}
                </span>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    cfg.accent,
                  )}
                >
                  {cfg.tag}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "result") {
    const pct = correctCount / (questions.length || 1);
    let stars = 1;
    if (pct >= 0.9) stars = 3;
    else if (pct >= 0.6) stars = 2;
    if (!completed) stars = Math.min(stars, 1);

    return (
      <div className="rounded-3xl border border-border bg-card px-6 py-12 text-center shadow-soft">
        <div className="text-5xl" aria-hidden>
          {completed ? (stars === 3 ? "🏆" : "🚀") : "🛰️"}
        </div>
        <h2 className="mt-3 font-display text-2xl font-semibold">
          {completed ? `¡Llegaste a ${level.name}!` : "La nave necesita reparación"}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {completed
            ? "¡Gran trabajo, astronauta!"
            : "Recarga combustible e inténtalo otra vez."}
        </p>
        <p className="mt-5 text-3xl tracking-[0.2em]" aria-label={`${stars} de 3 estrellas`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className={i < stars ? undefined : "opacity-20"}>
              ⭐
            </span>
          ))}
        </p>
        <div className="mt-6 flex justify-center gap-10">
          <div>
            <div className="font-display text-xl font-semibold text-accent-foreground">
              {correctCount}/{questions.length}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Correctas
            </div>
          </div>
          <div>
            <div className="font-display text-xl font-semibold text-accent-foreground">
              {score}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Puntos
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => startLevel(level)}
            className="rounded-full bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
          >
            Intentar de nuevo
          </button>
          <button
            type="button"
            onClick={() => setScreen("select")}
            className="rounded-full border border-border px-6 py-3 font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Otro planeta
          </button>
        </div>
      </div>
    );
  }

  const q = questions[index]!;
  const progress = (index / questions.length) * 100;

  return (
    <div className="rounded-3xl border border-border bg-card px-5 py-8 shadow-soft sm:px-8">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setScreen("select")}
          className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Planetas
        </button>
        <span className="text-base tracking-widest" aria-label={`${lives} vidas`}>
          {"❤️".repeat(Math.max(0, lives)) + "🤍".repeat(MAX_LIVES - Math.max(0, lives))}
        </span>
        <span className="rounded-full bg-secondary px-3.5 py-1.5 font-display text-sm font-semibold text-secondary-foreground">
          {score} pts
        </span>
      </div>

      <div className="relative mx-5 mt-8 h-1.5 rounded-full bg-muted">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <span
          aria-hidden
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg transition-all duration-500"
          style={{ left: `${progress}%` }}
        >
          🚀
        </span>
        <span aria-hidden className="absolute -right-3.5 top-1/2 -translate-y-1/2 text-xl">
          {level.emoji}
        </span>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-background px-6 py-9 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Pregunta {index + 1} de {questions.length}
        </p>
        <p className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
          {q.a} × {q.b}
        </p>
        <p
          aria-live="polite"
          className={cn(
            "mt-3 min-h-6 font-display text-sm font-semibold",
            feedback?.ok ? "text-primary" : "text-play-coral",
          )}
        >
          {feedback?.text ?? ""}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {choices.map((val) => {
          const isCorrect = chosen !== null && val === q.answer;
          const isWrong = chosen === val && val !== q.answer;
          return (
            <button
              key={val}
              type="button"
              disabled={chosen !== null}
              onClick={() => handleAnswer(val)}
              className={cn(
                "rounded-2xl border border-border bg-background px-3 py-5 font-display text-2xl font-semibold transition-all",
                chosen === null && "hover:-translate-y-1 hover:border-primary/50",
                isCorrect && "border-primary bg-primary/10 text-primary",
                isWrong && "border-play-coral bg-play-coral/10 text-play-coral",
              )}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
}
