/**
 * Quién soy: hero, sobre mí, habilidades y contacto. Textos del mockup v2
 * (docs/mockup-v2.dc.html).
 *
 * Títulos y estudios no van en el sitio: viven en LinkedIn, y el dato "Perfil"
 * enlaza allá.
 */

import type { ContactLink, Profile } from "./types";

// Mis cuentas, en un solo lugar. Si cambia un usuario, cambia acá.
export const GITHUB_USER = "juanvasquezdev";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
export const INSTAGRAM_USER = "juanvasquezhj";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_USER}`;
export const LINKEDIN_URL = "https://www.linkedin.com/in/juan-jos%C3%A9-vasquez-giraldo/";
export const EMAIL = "juanjosevasquez1313@gmail.com";

const CONTACT_LINKS: ContactLink[] = [
  { id: "email", label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, external: false },
  { id: "github", label: "GitHub", value: GITHUB_USER, href: GITHUB_URL, external: true },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "Juan José Vásquez Giraldo",
    href: LINKEDIN_URL,
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    value: `@${INSTAGRAM_USER}`,
    href: INSTAGRAM_URL,
    external: true,
  },
];

export const PROFILE: Profile = {
  name: "Juan José Vásquez Giraldo",

  hero: {
    eyebrow: "Cali, Colombia · 2026",
    nameLines: ["Juan José", "Vásquez"],
    tags: [
      { es: "Desarrollador Full Stack en formación", en: "Full Stack Developer in training" },
      { es: "Atleta de alto rendimiento", en: "High-performance athlete" },
    ],
    scrollCue: { es: "Desliza", en: "Scroll" },
    image: {
      src: "/images/epica_trasera2.jpeg",
      alt: {
        es: "Juan José Vásquez de espaldas y con la cabeza baja, en blanco y negro contra el cielo",
        en: "Juan José Vásquez seen from behind, head lowered, in black and white against the sky",
      },
    },
  },

  about: {
    eyebrow: { es: "Sobre mí", en: "About" },
    heading: { es: "Sobre mí", en: "About me" },
    body: {
      es: "Desarrollador full stack en formación y atleta de salto alto de la Selección Colombia. Diseño y construyo sistemas para problemas reales, como la gestión deportiva y la de negocios, cuidando el rendimiento, la seguridad y que el código se pueda mantener. Al software le llevo la misma disciplina del entrenamiento: medir, ajustar y repetir.",
      en: "Full stack developer in training and high jumper for the Colombian national team. I design and build systems for real problems, such as sports and business management, with a focus on performance, security and maintainable code. I bring the same discipline from training into software: measure, adjust, repeat.",
    },
    facts: [
      {
        label: { es: "Base", en: "Based in" },
        value: { es: "Cali, Colombia", en: "Cali, Colombia" },
      },
      {
        label: { es: "Perfil", en: "Profile" },
        value: {
          es: "Full Stack Developer en formación",
          en: "Full Stack Developer in training",
        },
        link: {
          label: {
            es: "Formación y certificados en LinkedIn",
            en: "Education and certificates on LinkedIn",
          },
          href: LINKEDIN_URL,
        },
      },
      {
        label: { es: "Hoy", en: "Now" },
        value: { es: "Abierto a oportunidades laborales", en: "Open to job opportunities" },
      },
    ],
    portrait: {
      src: "/images/foto_posando2.jpeg",
      alt: {
        es: "Retrato de Juan José con la camiseta de Colombia",
        en: "Portrait of Juan José wearing the Colombia jersey",
      },
    },
  },

  skills: {
    eyebrow: { es: "Habilidades", en: "Skills" },
    heading: { es: "Cómo trabajo", en: "How I work" },
    items: [
      {
        title: { es: "Pensamiento de sistemas", en: "Systems thinking" },
        text: {
          es: "Veo el producto completo antes del código: módulos, datos y cómo va a crecer, sin construir de más antes de tiempo.",
          en: "I see the whole product before the code: modules, data and how it will grow, without overbuilding ahead of time.",
        },
      },
      {
        title: { es: "Resolver problemas reales", en: "Solving real problems" },
        text: {
          es: "Parto de una necesidad concreta, como una liga deportiva o una tienda que lleva todo en papel, y la convierto en un sistema usable.",
          en: "I start from a concrete need, like a sports league or a shop that runs on paper, and turn it into a usable system.",
        },
      },
      {
        title: { es: "Desarrollo con IA, con criterio", en: "AI-assisted development, with judgment" },
        text: {
          es: "Uso la IA para ir más rápido, pero reviso, entiendo y decido cada cambio antes de integrarlo.",
          en: "I use AI to move faster, but I review, understand and decide on every change before it goes in.",
        },
      },
      {
        title: { es: "Disciplina y constancia", en: "Discipline and consistency" },
        text: {
          es: "El alto rendimiento me enseñó a entrenar a diario, medir el progreso y competir bajo presión.",
          en: "High-performance sport taught me to train daily, measure progress and compete under pressure.",
        },
      },
      {
        title: { es: "Aprendizaje autodirigido", en: "Self-directed learning" },
        text: {
          es: "Aprendo construyendo: investigo, pruebo, me equivoco, corrijo y lo documento.",
          en: "I learn by building: research, try, fail, fix and document.",
        },
      },
      {
        title: { es: "Orden y documentación", en: "Order and documentation" },
        text: {
          es: "Git con ramas y commits claros, READMEs útiles y decisiones técnicas escritas.",
          en: "Git with branches and clear commits, useful READMEs and written technical decisions.",
        },
      },
    ],
    languagesLabel: { es: "Idiomas", en: "Languages" },
    languages: [
      {
        name: { es: "Español", en: "Spanish" },
        level: { es: "Nativo", en: "Native" },
        improving: false,
      },
      {
        name: { es: "Inglés", en: "English" },
        level: { es: "B1-B2 · en mejora", en: "B1-B2 · improving" },
        improving: true,
      },
    ],
  },

  contact: {
    eyebrow: { es: "Contacto", en: "Contact" },
    heading: { es: "Hablemos.", en: "Let’s talk." },
    intro: {
      es: "Escríbeme por el canal que prefieras.",
      en: "Reach out on whichever channel you prefer.",
    },
    links: CONTACT_LINKS,
  },

  footer: {
    copyright: "© 2026 Juan José Vásquez Giraldo",
    tagline: { es: "Cali, Colombia · Hecho con Next.js", en: "Cali, Colombia · Built with Next.js" },
  },
};
