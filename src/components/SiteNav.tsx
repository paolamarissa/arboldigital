import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Inicio" },
  { to: "/biblioteca", label: "Biblioteca" },
  { to: "/juegos", label: "Juegos" },
  { to: "/manualidades", label: "Manualidades" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-secondary-foreground"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <circle cx="12" cy="9" r="6" />
              <rect x="11" y="13" width="2" height="8" rx="1" />
            </svg>
          </span>
          <span className="font-display text-base font-semibold tracking-tight">
            El Árbol Digital
          </span>
        </Link>

        <ul className="flex items-center gap-1 text-sm font-medium">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-secondary-foreground"
                activeProps={{
                  className: "bg-secondary text-secondary-foreground",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
