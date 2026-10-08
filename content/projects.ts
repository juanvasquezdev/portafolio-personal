/**
 * Proyectos (sistemas grandes, con su problema y su solución) y Herramientas
 * (apps chicas que corren en el navegador, con su código abierto).
 *
 * En Proyectos, sin `repoUrl` la tarjeta dice "Repo privado" y no enlaza a un
 * 404; con `repoUrl` pasa sola a ser un enlace al repo.
 */

import { GITHUB_URL } from "./profile";
import type { Projects, Tools } from "./types";

export const PROJECTS: Projects = {
  eyebrow: { es: "Proyectos", en: "Projects" },
  heading: { es: "Proyectos", en: "Projects" },
  intro: {
    es: "Sistemas reales en distintas etapas: qué resuelven, cómo están hechos y en qué van.",
    en: "Real systems at different stages: what they solve, how they are built and where they stand.",
  },
  privateRepoLabel: { es: "Repo privado", en: "Private repo" },

  items: [
    {
      slug: "athletics-hub",
      title: { es: "Athletics Hub", en: "Athletics Hub" },
      statusLabel: { es: "En construcción", en: "In progress" },
      live: false,
      problem: {
        es: "La Liga Vallecaucana de Atletismo no tiene un sistema digital para atletas, competencias, resultados y rankings.",
        en: "The Liga Vallecaucana de Atletismo has no digital system for athletes, competitions, results and rankings.",
      },
      solution: {
        es: "Plataforma propia en un monorepo: API en NestJS con Prisma y PostgreSQL, autenticación con hashing argon2id, y CI con tests de unidad, integración y E2E.",
        en: "A platform of my own in a monorepo: NestJS API with Prisma and PostgreSQL, argon2id password hashing, and CI with unit, integration and E2E tests.",
      },
      stack: ["NestJS", "Bun", "Prisma", "PostgreSQL", "Docker", "React 19"],
    },
    {
      slug: "nudo",
      title: { es: "Nudo", en: "Nudo" },
      statusLabel: { es: "En consolidación", en: "Consolidating" },
      live: false,
      problem: {
        es: "Empresas y familias que manejan inventario, ventas, deudas y caja en papel, sin datos para decidir.",
        en: "Businesses and families running inventory, sales, debts and cash on paper, with no data to make decisions.",
      },
      solution: {
        es: "Primer eslabón de una plataforma de gestión más grande: un ERP modular al que se le suman capas de IA que analizan, controlan y automatizan, y agentes que ejecutan acciones. Cada módulo funciona solo o conectado a los demás.",
        en: "The first link of a larger management platform: a modular ERP with AI layers that analyze, control and automate, and agents that take action. Each module works on its own or connected to the rest.",
      },
      // PENDIENTE: el mockup trae un quinto chip "[confirmar stack]". No lo
      // publico con corchetes; cuando tenga el stack completo, va acá.
      stack: ["Node.js", "NestJS", "PostgreSQL", "Prisma"],
    },
    {
      slug: "nyx",
      title: { es: "Nyx", en: "Nyx" },
      statusLabel: { es: "En desarrollo", en: "In development" },
      live: false,
      problem: {
        es: "Tiendas pequeñas y rurales que necesitan algo más simple que un ERP, que funcione en local.",
        en: "Small and rural shops that need something simpler than an ERP, running locally.",
      },
      solution: {
        es: "Gestión local de productos, stock, ventas, fiados con abonos y caja diaria. Funciona sin internet, en escritorio o como app en el celular.",
        en: "Local management of products, stock, sales, store credit with partial payments and a daily cash register. Works offline, on desktop or as a phone app.",
      },
      stack: ["React", "Vite", "TypeScript", "Express", "SQLite", "PWA"],
    },
    {
      slug: "portafolio",
      title: { es: "Portafolio personal", en: "Personal portfolio" },
      statusLabel: { es: "Vivo", en: "Live" },
      live: true,
      problem: {
        es: "Mostrar en un solo lugar coherente el lado técnico y el atlético.",
        en: "Showing the technical side and the athletic one in a single coherent place.",
      },
      solution: {
        es: "Este mismo sitio: migrado de un builder no-code a Next.js y TypeScript, auditado y construido por fases.",
        en: "This very site: moved off a no-code builder to Next.js and TypeScript, audited and built in phases.",
      },
      // El mockup dice Tailwind, pero lo saqué en la Fase 1: el CSS es propio.
      stack: ["Next.js", "TypeScript", "CSS", "Playwright"],
      repoUrl: `${GITHUB_URL}/portafolio-personal`,
    },
  ],
};

// Las herramientas viven en otro repo (un monorepo, una app por carpeta) y se
// publican juntas en un solo sitio, cada una en su ruta.
const TOOLS_SITE = "https://juanvasquez-herramientas.vercel.app";
const TOOLS_REPO = `${GITHUB_URL}/herramientas/tree/main/apps`;

export const TOOLS: Tools = {
  eyebrow: { es: "Herramientas", en: "Tools" },
  heading: { es: "Herramientas", en: "Tools" },
  intro: {
    es: "Herramientas pequeñas, cada una para una tarea concreta. Corren en el navegador, no piden cuenta y guardan los datos en tu propio equipo.",
    en: "Small tools, each built for one specific task. They run in the browser, need no account and keep your data on your own device. Their interface is in Spanish.",
  },
  cta: { es: "Ver todas las herramientas", en: "See all tools" },
  ctaUrl: TOOLS_SITE,
  open: {
    label: { es: "Abrir", en: "Open" },
    ariaLabel: { es: "Abrir {name}", en: "Open {name}" },
  },
  code: {
    label: { es: "Ver código", en: "View code" },
    ariaLabel: { es: "Ver código de {name}", en: "View code for {name}" },
  },

  items: [
    {
      name: { es: "Análisis de salto en video", en: "Jump video analysis" },
      kind: { es: "Deporte · Visión por computador", en: "Sport · Computer vision" },
      description: {
        es: "Mide ángulos y tiempo de contacto de un salto, cuadro por cuadro. El video se procesa en el navegador y no se sube a ningún servidor.",
        en: "Measures joint angles and ground contact time of a jump, frame by frame. The video is processed in the browser and never uploaded.",
      },
      liveUrl: `${TOOLS_SITE}/biomecanica`,
      repoUrl: `${TOOLS_REPO}/biomecanica`,
    },
    {
      name: { es: "Cotizador", en: "Quote builder" },
      kind: { es: "Negocio", en: "Business" },
      description: {
        es: "Arma una cotización con ítems e impuesto y la exporta en PDF. Lleva el consecutivo y recuerda los datos de la empresa.",
        en: "Builds a quote with line items and tax and exports it as a PDF. Keeps the numbering and remembers your business details.",
      },
      liveUrl: `${TOOLS_SITE}/cotizador`,
      repoUrl: `${TOOLS_REPO}/cotizador`,
    },
    {
      name: { es: "Precio y rentabilidad", en: "Pricing and margin" },
      kind: { es: "Negocio", en: "Business" },
      description: {
        es: "Calcula a cómo vender para cubrir costos y ganar el margen que se quiere, con punto de equilibrio.",
        en: "Works out the selling price that covers costs and hits a target margin, with the break-even point.",
      },
      liveUrl: `${TOOLS_SITE}/rentabilidad`,
      repoUrl: `${TOOLS_REPO}/rentabilidad`,
    },
    {
      name: { es: "Registro de marcas", en: "Performance log" },
      kind: { es: "Deporte", en: "Sport" },
      description: {
        es: "Lleva las marcas de un atleta por prueba, dibuja la progresión y saca un reporte en PDF.",
        en: "Tracks an athlete's marks by event, charts the progression and produces a PDF report.",
      },
      liveUrl: `${TOOLS_SITE}/marcas`,
      repoUrl: `${TOOLS_REPO}/marcas`,
    },
    {
      name: { es: "Planificador de cargas", en: "Load planner" },
      kind: { es: "Deporte", en: "Sport" },
      description: {
        es: "Planea la semana de fuerza y compara el volumen con la semana anterior.",
        en: "Plans the strength week and compares its volume with the previous one.",
      },
      liveUrl: `${TOOLS_SITE}/cargas`,
      repoUrl: `${TOOLS_REPO}/cargas`,
    },
    {
      name: { es: "Propuesta de servicios", en: "Service proposal" },
      kind: { es: "Negocio", en: "Business" },
      description: {
        es: "Deja por escrito alcance, entregables, valor y forma de pago, lista para firmar.",
        en: "Puts scope, deliverables, price and payment terms in writing, ready to sign.",
      },
      liveUrl: `${TOOLS_SITE}/propuesta`,
      repoUrl: `${TOOLS_REPO}/propuesta`,
    },
    {
      name: { es: "Calendario de contenido", en: "Content calendar" },
      kind: { es: "Contenido", en: "Content" },
      description: {
        es: "Organiza las publicaciones del mes y muestra qué tema y formato funcionan mejor.",
        en: "Organises the month's posts and shows which topics and formats perform best.",
      },
      liveUrl: `${TOOLS_SITE}/contenido`,
      repoUrl: `${TOOLS_REPO}/contenido`,
    },
    {
      name: { es: "Control por gestos", en: "Gesture control" },
      kind: { es: "Experimento", en: "Experiment" },
      description: {
        es: "Maneja un reproductor, diapositivas o una pizarra con la mano frente a la cámara.",
        en: "Controls a media player, slides or a drawing board with hand gestures in front of the camera.",
      },
      liveUrl: `${TOOLS_SITE}/gestos`,
      repoUrl: `${TOOLS_REPO}/gestos`,
    },
  ],
};
