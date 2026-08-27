import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LetterItem = { letra: string; emojiCorrecto: string; opciones: string[] };
type SyllableItem = { silaba: string; piezas: string[] };
type WordItem = { palabra: string; emoji: string; piezas: string[] };

const ROUNDS = 6;

const LETRAS: LetterItem[] = [
  { letra: "A", emojiCorrecto: "🐝", opciones: ["🐝", "🐶", "🐟"] },
  { letra: "M", emojiCorrecto: "🐒", opciones: ["🐒", "🦁", "🐢"] },
  { letra: "O", emojiCorrecto: "🐻", opciones: ["🐟", "🐻", "🦋"] },
  { letra: "S", emojiCorrecto: "🐍", opciones: ["🐍", "🐴", "🐸"] },
  { letra: "P", emojiCorrecto: "🐧", opciones: ["🐧", "🐘", "🐛"] },
  { letra: "L", emojiCorrecto: "🦁", opciones: ["🐢", "🦁", "🐝"] },
  { letra: "G", emojiCorrecto: "🐱", opciones: ["🐱", "🐟", "🐴"] },
  { letra: "T", emojiCorrecto: "🐯", opciones: ["🐯", "🐒", "🐸"] },
];

const SILABAS: SyllableItem[] = [
  { silaba: "MA", piezas: ["M", "A"] },
  { silaba: "PA", piezas: ["P", "A"] },
  { silaba: "SO", piezas: ["S", "O"] },
  { silaba: "LU", piezas: ["L", "U"] },
  { silaba: "TE", piezas: ["T", "E"] },
  { silaba: "NI", piezas: ["N", "I"] },
  { silaba: "MI", piezas: ["M", "I"] },
  { silaba: "DO", piezas: ["D", "O"] },
];

const PALABRAS: WordItem[] = [
  { palabra: "SOL", emoji: "☀️", piezas: ["S", "O", "L"] },
  { palabra: "PAN", emoji: "🍞", piezas: ["P", "A", "N"] },
  { palabra: "OSO", emoji: "🐻", piezas: ["O", "S", "O"] },
  { palabra: "LUNA", emoji: "🌙", piezas: ["L", "U", "N", "A"] },
  { palabra: "PATO", emoji: "🦆", piezas: ["P", "A", "T", "O"] },
  { palabra: "MESA", emoji: "🪑", piezas: ["M", "E", "S", "A"] },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  let spoken = text.toLowerCase();
  if (spoken.length === 2) spoken += spoken.slice(-1);
  const u = new SpeechSynthesisUtterance(spoken);
  u.lang = "es-MX";
  u.rate = 0.85;
  u.pitch = 1.1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

type Screen = "inicio" | "nivel1" | "nivel2" | "nivel3" | "final";

const NIVELES = [
  { n: 1 as const, emoji: "🔤", title: "Sonidos de letras", accent: "bg-play-coral/15 text-play-coral" },
  { n: 2 as const, emoji: "🧩", title: "Armar sílabas", accent: "bg-primary/15 text-primary" },
  { n: 3 as const, emoji: "📝", title: "Formar palabras", accent: "bg-play-pink/15 text-play-pink" },
];

export function BuhoGame() {
  const [screen, setScreen] = useState<Screen>("inicio");
  const [nombre, setNombre] = useState("");
  const [puntos, setPuntos] = useState(0);
  const [ronda, setRonda] = useState(0);
  const [mood, setMood] = useState<"idle" | "happy" | "oops">("idle");
  const [mensaje, setMensaje] = useState<{ text: string; ok: boolean } | null>(null);

  // nivel 1
  const [letra, setLetra] = useState<LetterItem>(LETRAS[0]!);
  const [opciones, setOpciones] = useState<string[]>([]);
  const [malas, setMalas] = useState<string[]>([]);
  const [acertada, setAcertada] = useState<string | null>(null);

  // niveles 2 y 3
  const [target, setTarget] = useState<{ text: string; emoji?: string; piezas: string[] }>({
    text: "MA",
    piezas: ["M", "A"],
  });
  const [banco, setBanco] = useState<string[]>([]);
  const [usadas, setUsadas] = useState<number[]>([]);
  const [slots, setSlots] = useState<(string | null)[]>([]);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  const animar = (tipo: "happy" | "oops") => {
    setMood("idle");
    requestAnimationFrame(() => setMood(tipo));
    later(() => setMood("idle"), 700);
  };

  const rondaNivel1 = useCallback(() => {
    const item = pick(LETRAS);
    setLetra(item);
    setOpciones(shuffle(item.opciones));
    setMalas([]);
    setAcertada(null);
    setMensaje(null);
    later(() => speak(item.letra), 300);
  }, []);

  const rondaArmar = useCallback((nivel: 2 | 3) => {
    if (nivel === 2) {
      const item = pick(SILABAS);
      setTarget({ text: item.silaba, piezas: item.piezas });
      setBanco(shuffle([...item.piezas, ...shuffle(["R", "F", "B", "C", "V"]).slice(0, 1)]));
      setSlots(new Array(item.piezas.length).fill(null));
      later(() => speak(item.silaba), 300);
    } else {
      const item = pick(PALABRAS);
      setTarget({ text: item.palabra, emoji: item.emoji, piezas: item.piezas });
      setBanco(shuffle([...item.piezas, ...shuffle(["R", "F", "B", "C", "V", "D"]).slice(0, 2)]));
      setSlots(new Array(item.piezas.length).fill(null));
      later(() => speak(item.palabra), 300);
    }
    setUsadas([]);
    setMensaje(null);
  }, []);

  const iniciarNivel = (n: 1 | 2 | 3) => {
    setPuntos(0);
    setRonda(0);
    if (n === 1) rondaNivel1();
    else rondaArmar(n);
    setScreen(`nivel${n}` as Screen);
  };

  const avanzar = (nivel: 1 | 2 | 3) => {
    const next = ronda + 1;
    setRonda(next);
    later(() => {
      if (next >= ROUNDS) {
        setScreen("final");
        return;
      }
      if (nivel === 1) rondaNivel1();
      else rondaArmar(nivel);
    }, 1300);
  };

  const responderNivel1 = (emo: string) => {
    if (acertada) return;
    if (emo === letra.emojiCorrecto) {
      setAcertada(emo);
      setPuntos((p) => p + 1);
      setMensaje({ text: "¡Sí! Muy bien 🎉", ok: true });
      animar("happy");
      avanzar(1);
    } else {
      setMalas((m) => [...m, emo]);
      setMensaje({ text: "Casi... ¡inténtalo otra vez!", ok: false });
      animar("oops");
    }
  };

  const colocar = (idx: number, val: string) => {
    const libre = slots.findIndex((v) => v === null);
    if (libre === -1) return;
    setSlots((s) => s.map((v, i) => (i === libre ? val : v)));
    setUsadas((u) => [...u, idx]);
  };

  const limpiar = () => {
    setSlots((s) => s.map(() => null));
    setUsadas([]);
  };

  const revisar = (nivel: 2 | 3) => {
    if (slots.join("") === target.text) {
      setPuntos((p) => p + 1);
      setMensaje({ text: `¡Perfecto! ${target.text} 🎉`, ok: true });
      animar("happy");
      avanzar(nivel);
    } else {
      setMensaje({ text: "Casi... escucha otra vez y prueba de nuevo", ok: false });
      animar("oops");
    }
  };

  const Buho = (
    <div className="flex justify-center">
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className={cn(
          "h-24 w-24",
          mood === "happy" && "animate-chomp",
          mood === "oops" && "animate-wiggle",
        )}
      >
        <ellipse cx="50" cy="58" rx="34" ry="32" fill="oklch(0.55 0.06 60)" />
        <circle cx="50" cy="34" r="26" fill="oklch(0.66 0.05 62)" />
        <circle cx="38" cy="32" r="12" fill="oklch(0.99 0.008 95)" />
        <circle cx="62" cy="32" r="12" fill="oklch(0.99 0.008 95)" />
        <circle cx="38" cy="32" r="6" fill="oklch(0.31 0.028 78.5)" />
        <circle cx="62" cy="32" r="6" fill="oklch(0.31 0.028 78.5)" />
        <polygon points="50,38 44,48 56,48" fill="oklch(0.83 0.14 88)" />
        <polygon points="22,18 34,10 34,26" fill="oklch(0.66 0.05 62)" />
        <polygon points="78,18 66,10 66,26" fill="oklch(0.66 0.05 62)" />
        <ellipse cx="50" cy="68" rx="16" ry="12" fill="oklch(0.965 0.02 92)" />
      </svg>
    </div>
  );

  const audioBtn = (label: string, text: string) => (
    <div className="mt-4 flex justify-center">
      <button
        type="button"
        onClick={() => speak(text)}
        className="rounded-full bg-play-teal/15 px-5 py-2.5 font-display text-sm font-semibold text-play-teal transition-transform hover:-translate-y-0.5"
      >
        🔊 {label}
      </button>
    </div>
  );

  const topbar = (
    <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={() => setScreen("inicio")}
        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Salir
      </button>
      <span className="rounded-full bg-secondary px-3.5 py-1.5 font-display text-sm font-semibold text-secondary-foreground">
        ⭐ {puntos}
      </span>
    </div>
  );

  const mensajeBlock = (
    <p
      aria-live="polite"
      className={cn(
        "mt-4 min-h-6 text-center font-display text-sm font-semibold",
        mensaje?.ok ? "text-primary" : "text-play-coral",
      )}
    >
      {mensaje?.text ?? ""}
    </p>
  );

  const shell = (children: React.ReactNode) => (
    <div className="rounded-3xl border border-border bg-card px-5 py-8 shadow-soft sm:px-8">
      {Buho}
      <h2 className="mt-3 text-center font-display text-2xl font-semibold">Leo con Búho</h2>
      <p className="mt-1.5 text-center text-sm text-muted-foreground">
        {screen === "inicio"
          ? "Un juego para aprender a leer jugando"
          : nombre
            ? `¡Vamos, ${nombre}!`
            : `Ronda ${Math.min(ronda + 1, ROUNDS)} de ${ROUNDS}`}
      </p>
      <div className="mt-6">{children}</div>
    </div>
  );

  if (screen === "inicio") {
    return shell(
      <div className="mx-auto max-w-xl">
        <div className="flex justify-center">
          <input
            type="text"
            value={nombre}
            maxLength={16}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="¿Cómo te llamas?"
            className="w-64 rounded-2xl border border-border bg-background px-4 py-3 text-center font-display text-sm font-semibold outline-none focus-visible:border-primary"
          />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">Elige un nivel para jugar:</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {NIVELES.map((lvl) => (
            <button
              key={lvl.n}
              type="button"
              onClick={() => iniciarNivel(lvl.n)}
              className="rounded-2xl border border-border bg-background p-5 text-center shadow-soft transition-transform hover:-translate-y-0.5"
            >
              <span aria-hidden className="block text-3xl">
                {lvl.emoji}
              </span>
              <span className="mt-2 block font-display text-sm font-semibold">{lvl.title}</span>
              <span
                className={cn(
                  "mt-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  lvl.accent,
                )}
              >
                Nivel {lvl.n}
              </span>
            </button>
          ))}
        </div>
      </div>,
    );
  }

  if (screen === "final") {
    return shell(
      <div className="text-center">
        <div className="text-5xl" aria-hidden>
          🏆
        </div>
        <h3 className="mt-3 font-display text-xl font-semibold">
          {nombre ? `¡Muy bien, ${nombre}!` : "¡Muy bien!"}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Completaste todas las rondas con {puntos} estrellas.
        </p>
        <button
          type="button"
          onClick={() => setScreen("inicio")}
          className="mt-6 rounded-full bg-primary px-6 py-3 font-display text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
        >
          Elegir otro nivel
        </button>
      </div>,
    );
  }

  if (screen === "nivel1") {
    return shell(
      <div>
        {topbar}
        <p className="mt-6 text-center font-display text-sm font-semibold">
          ¿Qué empieza con este sonido?
        </p>
        <p className="mt-2 text-center font-display text-6xl font-semibold tracking-widest text-play-coral">
          {letra.letra}
        </p>
        {audioBtn("Escuchar", letra.letra)}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {opciones.map((emo) => (
            <button
              key={emo}
              type="button"
              disabled={malas.includes(emo) || acertada !== null}
              onClick={() => responderNivel1(emo)}
              className={cn(
                "rounded-2xl border border-border bg-background py-5 text-4xl transition-all",
                acertada === emo && "border-primary bg-primary/10",
                malas.includes(emo) && "border-play-coral bg-play-coral/10 opacity-60",
                !acertada && !malas.includes(emo) && "hover:-translate-y-1 hover:border-primary/50",
              )}
            >
              {emo}
            </button>
          ))}
        </div>
        {mensajeBlock}
      </div>,
    );
  }

  const nivel = screen === "nivel2" ? 2 : 3;
  return shell(
    <div>
      {topbar}
      <p className="mt-6 text-center font-display text-sm font-semibold">
        {nivel === 2 ? "Arma la sílaba que escuchas" : "Forma la palabra de la imagen"}
      </p>
      {nivel === 3 && (
        <p className="mt-3 text-center text-5xl" aria-hidden>
          {target.emoji}
        </p>
      )}
      {audioBtn(nivel === 2 ? "Escuchar sílaba" : "Escuchar palabra", target.text)}

      <div className="mt-6 flex justify-center gap-2">
        {slots.map((val, i) => (
          <span
            key={i}
            className={cn(
              "grid h-14 w-14 place-items-center rounded-2xl border-2 border-dashed border-border bg-background font-display text-xl font-semibold",
              val && "border-solid border-primary bg-primary/10 text-primary",
            )}
          >
            {val ?? ""}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {banco.map((val, idx) => (
          <button
            key={`${val}-${idx}`}
            type="button"
            disabled={usadas.includes(idx)}
            onClick={() => colocar(idx, val)}
            className={cn(
              "rounded-2xl bg-accent px-4 py-3 font-display text-lg font-semibold text-accent-foreground shadow-soft transition-transform",
              usadas.includes(idx) ? "opacity-25" : "hover:-translate-y-0.5",
            )}
          >
            {val}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={limpiar}
          className="rounded-full border border-border px-5 py-2.5 font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          ↺ Borrar
        </button>
        <button
          type="button"
          onClick={() => revisar(nivel as 2 | 3)}
          className="rounded-full bg-primary px-6 py-2.5 font-display text-sm font-semibold text-primary-foreground shadow-lift transition-transform hover:-translate-y-0.5"
        >
          ✔ Revisar
        </button>
      </div>
      {mensajeBlock}
    </div>,
  );
}
