import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Word = { word: string; article: "el" | "la" };

const LEVELS: { name: string; words: Word[] }[] = [
  {
    name: "Fácil",
    words: [
      { word: "sol", article: "el" },
      { word: "pez", article: "el" },
      { word: "oso", article: "el" },
      { word: "pan", article: "el" },
      { word: "luz", article: "la" },
      { word: "paz", article: "la" },
      { word: "ojo", article: "el" },
      { word: "pie", article: "el" },
    ],
  },
  {
    name: "Medio",
    words: [
      { word: "gato", article: "el" },
      { word: "perro", article: "el" },
      { word: "casa", article: "la" },
      { word: "flor", article: "la" },
      { word: "pato", article: "el" },
      { word: "tren", article: "el" },
      { word: "mesa", article: "la" },
      { word: "silla", article: "la" },
    ],
  },
  {
    name: "Difícil",
    words: [
      { word: "zapato", article: "el" },
      { word: "sombrero", article: "el" },
      { word: "globo", article: "el" },
      { word: "nube", article: "la" },
      { word: "estrella", article: "la" },
      { word: "pastel", article: "el" },
      { word: "helado", article: "el" },
      { word: "plátano", article: "el" },
    ],
  },
  {
    name: "Experto",
    words: [
      { word: "manzana", article: "la" },
      { word: "elefante", article: "el" },
      { word: "jirafa", article: "la" },
      { word: "mariposa", article: "la" },
      { word: "avión", article: "el" },
      { word: "cuchara", article: "la" },
      { word: "tortuga", article: "la" },
      { word: "ventana", article: "la" },
    ],
  },
];

const MAX_MISTAKES = 3;

const TILE_BORDERS = [
  "border-b-play-coral",
  "border-b-play-teal",
  "border-b-play-yellow",
  "border-b-play-pink",
  "border-b-primary",
];

function sample<T>(arr: T[], n: number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]!);
  }
  return out;
}

function Monster({
  mood,
  className,
  onClick,
  label,
}: {
  mood: "normal" | "chomp" | "sad" | "happy";
  className?: string;
  onClick?: () => void;
  label: string;
}) {
  const mouth =
    mood === "chomp"
      ? "M75 122 Q100 158 125 122 Q100 138 75 122 Z"
      : mood === "happy"
        ? "M75 125 Q100 155 125 125 Q100 140 75 125 Z"
        : "M75 128 Q100 148 125 128";
  const filled = mood === "chomp" || mood === "happy";

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "select-none",
        mood === "chomp" && "animate-chomp",
        mood === "sad" && "animate-wiggle",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <ellipse cx="100" cy="185" rx="60" ry="10" fill="#3A2E5222" />
      <path
        d="M40 110 C40 55 70 25 100 25 C130 25 160 55 160 110 C160 150 140 175 100 175 C60 175 40 150 40 110 Z"
        fill="#6C4AB6"
      />
      <path
        d="M55 120 C55 150 75 165 100 165 C125 165 145 150 145 120 C145 145 125 155 100 155 C75 155 55 145 55 120 Z"
        fill="#8B6BD6"
      />
      <circle cx="70" cy="80" r="6" fill="#FF9F43" />
      <circle cx="130" cy="95" r="8" fill="#FF9F43" />
      <circle cx="105" cy="55" r="5" fill="#FF9F43" />
      <circle cx="78" cy="95" r="16" fill="#fff" />
      <circle cx="122" cy="95" r="16" fill="#fff" />
      <circle cx="80" cy="97" r="8" fill="#3A2E52" />
      <circle cx="124" cy="97" r="8" fill="#3A2E52" />
      <path
        d={mouth}
        stroke="#3A2E52"
        strokeWidth="6"
        fill={filled ? "#3A2E52" : "none"}
        strokeLinecap="round"
      />
      <ellipse cx="35" cy="100" rx="10" ry="16" fill="#6C4AB6" />
      <ellipse cx="165" cy="100" rx="10" ry="16" fill="#6C4AB6" />
    </svg>
  );
}

export function GlupGame() {
  const [screen, setScreen] = useState<"start" | "game" | "victory">("start");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [options, setOptions] = useState<Word[]>([]);
  const [target, setTarget] = useState<Word>({ word: "", article: "la" });
  const [bubble, setBubble] = useState("¡Ñam! Quiero comer...");
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean }>({
    text: "",
    ok: true,
  });
  const [mood, setMood] = useState<"normal" | "chomp" | "sad">("normal");
  const [picked, setPicked] = useState<string | null>(null);

  const locked = useRef(false);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) return;
    const pick = () => {
      const voices = synth.getVoices();
      voice.current =
        voices.find((v) => /es-MX/i.test(v.lang)) ??
        voices.find((v) => /es-/i.test(v.lang)) ??
        voices.find((v) => /es/i.test(v.lang)) ??
        null;
    };
    pick();
    synth.addEventListener("voiceschanged", pick);
    return () => {
      synth.removeEventListener("voiceschanged", pick);
      synth.cancel();
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const speak = useCallback(
    (text: string, onend?: () => void) => {
      const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
      if (!synth) {
        if (onend) later(onend, 900);
        return;
      }
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "es-MX";
      if (voice.current) utter.voice = voice.current;
      utter.rate = 0.85;
      utter.pitch = 1.15;
      if (onend) {
        utter.onend = onend;
        utter.onerror = onend;
      }
      synth.speak(utter);
    },
    [later],
  );

  const newRound = useCallback(
    (lvl: number, idx: number) => {
      locked.current = false;
      setPicked(null);
      setFeedback({ text: "", ok: true });
      const levelWords = LEVELS[lvl]!.words;
      const next = levelWords[idx]!;
      const count = Math.min(4 + lvl, levelWords.length);
      const distractors = sample(
        levelWords.filter((w) => w.word !== next.word),
        count - 1,
      );
      setTarget(next);
      setOptions(sample([next, ...distractors], count));
      setBubble(`¡Ñam! Quiero comer ${next.word}...`);
      later(() => speak(`¡Ñam ñam! Quiero comer ${next.word}`), 350);
    },
    [later, speak],
  );

  const advance = useCallback(() => {
    const total = LEVELS[level]!.words.length;
    const nextIdx = wordIndex + 1;
    if (nextIdx >= total) {
      if (level + 1 >= LEVELS.length) {
        setScreen("victory");
        speak("¡Completaste todos los niveles! Eres un campeón de las palabras.");
        return;
      }
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setWordIndex(0);
      setMistakes(0);
      speak(`¡Subiste de nivel! Ahora vienen palabras de ${LEVELS[nextLevel]!.name}`, () =>
        later(() => newRound(nextLevel, 0), 900),
      );
    } else {
      setWordIndex(nextIdx);
      later(() => newRound(level, nextIdx), 1200);
    }
  }, [later, level, newRound, speak, wordIndex]);

  const restartLevel = useCallback(() => {
    locked.current = true;
    setWordIndex(0);
    setMistakes(0);
    setFeedback({ text: "Vamos a intentar este nivel de nuevo, ¡tú puedes! 💪", ok: false });
    speak("Vamos a intentar este nivel de nuevo. Tú puedes.", () =>
      later(() => newRound(level, 0), 900),
    );
  }, [later, level, newRound, speak]);

  const choose = (w: Word) => {
    if (locked.current) return;
    if (w.word === target.word) {
      locked.current = true;
      setPicked(w.word);
      setMood("chomp");
      setScore((s) => s + 1);
      setFeedback({ text: `¡Muy bien! Glup se comió "${w.word}" 😋`, ok: true });
      later(() => setMood("normal"), 520);
      speak(w.word, () => speak(`¡Muy bien! Gracias por ${target.article} ${w.word}`, advance));
    } else {
      setMood("sad");
      const next = mistakes + 1;
      setMistakes(next);
      setFeedback({ text: "Esa no es. ¡Escucha otra vez! 👂", ok: false });
      later(() => setMood("normal"), 460);
      speak(w.word);
      if (next >= MAX_MISTAKES) later(restartLevel, 900);
    }
  };

  const start = () => {
    setScreen("game");
    setScore(0);
    setLevel(0);
    setWordIndex(0);
    setMistakes(0);
    speak("Hola, soy Glup. Vamos a jugar.");
    later(() => newRound(0, 0), 1400);
  };

  const hearts = "❤️".repeat(Math.max(0, MAX_MISTAKES - mistakes)) + "🤍".repeat(mistakes);

  if (screen === "start" || screen === "victory") {
    const victory = screen === "victory";
    return (
      <div className="grid place-items-center rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-soft">
        <Monster
          mood={victory ? "happy" : "normal"}
          label={victory ? "Glup el monstruo muy feliz" : "Glup el monstruo"}
          className="w-32"
        />
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {victory
            ? "¡Completaste todos los niveles! Eres un campeón de las palabras 🏆"
            : "Glup tiene mucha hambre de palabras. Toca «Empezar» y escucha bien lo que dice."}
        </p>
        <button
          type="button"
          onClick={start}
          className="mt-6 rounded-full bg-primary px-8 py-3 font-display text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {victory ? "▶ Jugar de nuevo" : "▶ Empezar a jugar"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card px-5 py-8 text-center shadow-soft sm:px-8">
      <div className="flex flex-wrap items-center justify-center gap-3 font-display text-sm font-semibold">
        <span>
          <span className="text-accent">⭐</span> {score}
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="text-muted-foreground">
          Nivel {level + 1} · {LEVELS[level]!.name} · {wordIndex + 1}/
          {LEVELS[level]!.words.length}
        </span>
        <span className="text-muted-foreground/50">·</span>
        <span className="tracking-widest">{hearts}</span>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="relative max-w-md rounded-2xl bg-secondary px-6 py-3 font-display text-base font-semibold text-secondary-foreground">
          <span aria-live="polite">{bubble}</span>
          <span
            aria-hidden
            className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-secondary"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-center gap-4">
        <Monster
          mood={mood}
          label="Glup el monstruo"
          className="w-28 sm:w-36"
          onClick={() => speak(`¡Ñam ñam! Quiero comer ${target.word}`)}
        />
        <button
          type="button"
          onClick={() => speak(`¡Ñam ñam! Quiero comer ${target.word}`)}
          aria-label="Escuchar de nuevo qué palabra quiere Glup"
          className="rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-soft transition-transform hover:-translate-y-0.5"
        >
          🔊 Escuchar otra vez
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((w, i) => {
          const isPicked = picked === w.word;
          const dimmed = picked !== null && !isPicked;
          return (
            <button
              key={w.word}
              type="button"
              onClick={() => choose(w)}
              aria-label={`Palabra: ${w.word}`}
              className={cn(
                "rounded-2xl border-b-[6px] bg-background px-3 py-5 font-display text-xl font-semibold text-foreground shadow-soft transition-all",
                TILE_BORDERS[i % TILE_BORDERS.length],
                "hover:-translate-y-1",
                isPicked && "scale-90 bg-primary text-primary-foreground opacity-0",
                dimmed && "scale-95 opacity-30",
              )}
            >
              {w.word}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className={cn(
          "mt-6 min-h-6 font-display text-sm font-semibold",
          feedback.ok ? "text-primary" : "text-play-coral",
        )}
      >
        {feedback.text}
      </p>
    </div>
  );
}
