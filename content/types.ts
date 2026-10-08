/**
 * Formas del contenido bilingüe (diseño v2).
 *
 * Regla de la casa: lo que se traduce va como `L<T>`; nombres propios, URLs y
 * números van planos. Las marcas se guardan en metros como número y se
 * formatean al pintar (`lib/format.ts`): coma decimal en español, punto en
 * inglés. Así un dato no se escribe dos veces.
 */

// ---------------------------------------------------------------------------
// Primitivas bilingües
// ---------------------------------------------------------------------------

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Texto que existe en los dos idiomas. */
export type L<T = string> = Record<Locale, T>;

// ---------------------------------------------------------------------------
// Compartido
// ---------------------------------------------------------------------------

/** El "Sobre mí" de arriba (el número lo pone el CSS), el título y a veces un párrafo de intro. */
export type SectionHeader = {
  eyebrow: L;
  heading: L;
  intro?: L;
};

export type Photo = {
  src: string; // ruta dentro de public/
  alt: L;
};

// ---------------------------------------------------------------------------
// profile.ts — hero, sobre mí, habilidades, contacto
// ---------------------------------------------------------------------------

/** Una fila de la lista de datos de Sobre mí (Base, Perfil, Hoy). */
export type Fact = {
  label: L;
  value: L;
  link?: { label: L; href: string };
};

/** Tarjeta de Habilidades. El número ("01") sale de la posición. */
export type Skill = {
  title: L;
  text: L;
};

export type Language = {
  name: L;
  level: L;
  improving: boolean; // en mejora: se pinta en azul
};

export type ContactLink = {
  id: "email" | "github" | "linkedin" | "instagram";
  label: string; // nombre del canal, igual en los dos idiomas
  value: string; // lo que se muestra: usuario, email o nombre
  href: string;
  external: boolean;
};

export type Profile = {
  name: string; // nombre completo, para metadatos y footer
  hero: {
    eyebrow: string; // "Cali, Colombia · 2026"
    nameLines: string[]; // el nombre del <h1>, una entrada por renglón
    tags: L[]; // "Desarrollador Full Stack en formación" / "Atleta de alto rendimiento"
    scrollCue: L;
    image: Photo;
  };
  about: SectionHeader & {
    body: L;
    facts: Fact[];
    portrait: Photo;
  };
  skills: SectionHeader & {
    items: Skill[];
    languagesLabel: L;
    languages: Language[];
  };
  contact: SectionHeader & {
    links: ContactLink[];
  };
  footer: {
    copyright: string;
    tagline: L;
  };
};

// ---------------------------------------------------------------------------
// stack.ts
// ---------------------------------------------------------------------------

export type StackLevel = "deep" | "learning";

export type StackGroup = {
  title: L;
  level: StackLevel;
  // Los nombres propios van planos ("TypeScript"); lo que se traduce
  // ("Testing y CI/CD") va como L.
  items: (string | L)[];
};

export type Stack = SectionHeader & {
  levels: Record<StackLevel, L>; // "Profundizando" / "Aprendiendo"
  groups: StackGroup[];
  practicesLabel: L;
  practices: L[];
};

// ---------------------------------------------------------------------------
// projects.ts — proyectos y herramientas
// ---------------------------------------------------------------------------

export type Project = {
  slug: string;
  title: L; // casi siempre igual en los dos idiomas, salvo "Portafolio personal"
  statusLabel: L; // "En construcción", "Vivo"...
  live: boolean; // en producción (punto azul) o todavía en obra (punto coral)
  problem: L;
  solution: L;
  stack: string[];
  repoUrl?: string; // solo si el repo es público; sin esto se lee "Repo privado"
};

export type Projects = SectionHeader & {
  privateRepoLabel: L;
  items: Project[];
};

/** Herramienta chica que corre en el navegador. Solo se muestra si tiene
 * `repoUrl`, y la sección entera no sale mientras no haya ninguna. */
export type Tool = {
  name: L;
  kind: L; // "Negocio", "Deporte · Visión por computador"
  description: L;
  liveUrl?: string; // donde se abre la herramienta
  repoUrl?: string; // donde está el código
};

/** Texto visible de un enlace y su nombre accesible. En `ariaLabel`, `{name}`
 * se cambia por el nombre de la herramienta; tiene que empezar con `label`,
 * que es lo que dice en voz alta quien navega por voz. */
export type ToolLink = {
  label: L; // "Abrir"
  ariaLabel: L; // "Abrir {name}"
};

export type Tools = SectionHeader & {
  cta: L; // "Ver todas las herramientas"
  ctaUrl: string;
  open: ToolLink;
  code: ToolLink;
  items: Tool[];
};

// ---------------------------------------------------------------------------
// athletics.ts
// ---------------------------------------------------------------------------

/** Un resultado oficial, tal como figura en World Athletics. */
export type Result = {
  date: string; // ISO, "2026-07-05"; el año sale de acá
  mark: number; // metros
  place: number;
  competition: L;
  venue: string; // estadio y ciudad, nombre propio
};

export type AthleteStat = {
  mark: number; // metros
  label: L; // "Marca personal"
  tag: L; // "Oficial · World Athletics"
  official: boolean; // la etiqueta se resalta en azul
};

export type Achievement = {
  title: L;
  year: number;
  mark?: number; // metros; se agrega al lado del año si está
};

export type Affiliation = {
  name: L;
  note: L;
};

export type GalleryPhoto = Photo & { caption: L };

export type Athletics = SectionHeader & {
  image: Photo; // la foto grande de fondo
  stats: AthleteStat[];
  worldAthletics: { label: L; url: string; id: string };
  trackRecord: SectionHeader & {
    source: L;
    filters: { all: L; best: L };
    columns: { date: L; competition: L; place: L; mark: L };
    results: Result[];
  };
  achievementsLabel: L;
  achievements: Achievement[];
  affiliationsLabel: L;
  affiliations: Affiliation[];
  galleryLabel: L;
  gallery: GalleryPhoto[];
  instagramMore: L;
  sponsorship: SectionHeader & {
    points: L[];
    cta: L;
    mailSubject: L;
    instagram: {
      bio: L;
      follow: L;
      ariaLabel: L;
      grid: string[]; // 9 fotos de public/, decorativas
    };
  };
};

// ---------------------------------------------------------------------------
// seo.ts — lo que leen los buscadores y las redes, no el visitante
// ---------------------------------------------------------------------------

export type Seo = {
  title: L;
  description: L; // 140-160 caracteres: más largo, Google lo corta
  ogLocale: L; // "es_CO", "en_US"
  ogImage: { src: L; alt: L }; // 1200×630, en public/og/
  person: {
    name: string; // el nombre corto, como firmo
    alternateNames: string[]; // el completo y como figuro en World Athletics
    jobTitle: L;
    nationality: string;
    address: { locality: string; region: string; country: string }; // country: ISO, "CO"
  };
};

// ---------------------------------------------------------------------------
// ui.ts — navegación y etiquetas globales
// ---------------------------------------------------------------------------

export type NavLink = {
  id: string; // id de la sección a la que lleva; no se traduce
  label: L;
};

export type UI = {
  skipLink: L;
  navLabel: L; // aria-label del <nav> ("Navegación principal")
  nav: NavLink[];
  homeLabel: L; // aria-label de la marca "JV", que lleva arriba
  langLabel: L; // aria-label del segmentado ES | EN
  themeToLight: L; // aria-label del toggle cuando se ve oscuro
  themeToDark: L; // ídem cuando se ve claro
};
