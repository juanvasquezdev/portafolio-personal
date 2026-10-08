# Juan José Vásquez · Portafolio

Sitio personal bilingüe (ES/EN) de un desarrollador full stack que también es atleta de salto alto de la Selección Colombia.

**[PLACEHOLDER_URL](PLACEHOLDER_URL)** · [![CI](https://github.com/juanvasquezdev/portafolio-personal/actions/workflows/ci.yml/badge.svg)](https://github.com/juanvasquezdev/portafolio-personal/actions/workflows/ci.yml)

<p align="center">
  <img src="docs/screenshots/hero-desktop.webp" alt="Hero del sitio en escritorio, tema oscuro" width="73%">
  <img src="docs/screenshots/hero-mobile.webp" alt="Hero del sitio en celular, tema oscuro" width="21%">
</p>

<details>
<summary>Más capturas: Proyectos y Trayectoria</summary>
<br>
<img src="docs/screenshots/proyectos.webp" alt="Sección de proyectos con índice fijo y tarjetas">
<img src="docs/screenshots/trayectoria.webp" alt="Tabla de resultados oficiales con filtros por año">
</details>

**Stack:** Next.js 16 (App Router, render estático) · React 19 · TypeScript · CSS propio · Playwright · GitHub Actions · Vercel

## Decisiones técnicas

- **Animación solo con CSS.** *Problema:* motion y Lenis sumaban JS a una página que es casi todo contenido. *Decisión:* aparición al scroll con `animation-timeline: view()`; los componentes marcan qué anima con `data-reveal`. *Por qué:* el JS propio inicial quedó en **10,8 KiB gzip**. Donde el navegador no lo soporta, el contenido se ve quieto, y `prefers-reduced-motion` lo apaga todo.
- **CSP estricta sin renunciar al render estático.** *Problema:* un nonce por request obliga a renderizar cada visita. *Decisión:* los estilos van sin `'unsafe-inline'` (lo único inline es el `style` fijo de `next/image`, permitido por su hash), y `script-src-attr 'none'`. *Por qué:* los scripts sí conservan `'unsafe-inline'`, porque Next mete el payload de RSC inline y cambia con el contenido. Lo medí: con SRI y sin `'unsafe-inline'` la página no hidrata.
- **i18n estático con contenido tipado.** *Problema:* dos idiomas sin duplicar datos ni mandar los dos al navegador. *Decisión:* `/es` y `/en` salen del build, y los textos viven en `content/` como `L<T>` (un campo por idioma, verificado por TypeScript). *Por qué:* el servidor resuelve el idioma antes de pasar los datos a cada sección, así que el cliente solo recibe el suyo.
- **Datos oficiales de World Athletics.** *Problema:* las marcas de un atleta tienen que ser verificables. *Decisión:* los resultados se copian del perfil oficial como datos (fecha, marca en metros, puesto) y la marca personal se calcula de ellos, no se escribe aparte. *Por qué:* un dato vive en un solo lugar, y el formato (`2,05 m` / `2.05 m`) lo pone cada idioma.
- **SEO por idioma y previews fuera de Google.** *Problema:* dos idiomas en la misma URL base y deploys de preview públicos. *Decisión:* canonical, `hreflang` con `x-default`, sitemap con alternativas y JSON-LD `Person` por idioma. Si `VERCEL_ENV` no es `production`, robots devuelve `Disallow: /` y las páginas llevan `noindex`. *Por qué:* Google indexa cada versión con su idioma y nunca una preview.
- **Imagen para redes generada con Chromium.** *Problema:* `next/og` no lee woff2 y un PNG con foto pasa de 300 KB. *Decisión:* un script dibuja la tarjeta con HTML y las fuentes reales en el Chromium de Playwright y la guarda como JPEG, una por idioma. *Por qué:* queda idéntica al sitio y pesa ~65 KB.

## Calidad medida

| Qué | Resultado |
|---|---|
| Lighthouse móvil, `/es` y `/en` | Performance 94 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100 |
| JS inicial propio (gzip) | 10,8 KiB (presupuesto: 30 KiB) |
| JS inicial del framework (gzip) | 126,5 KiB (react-dom + runtime de Next) |
| Pruebas | 13 pruebas de humo con Playwright en CI, contra el build de producción |
| Contraste | AA en tema claro y oscuro, medido también sobre las fotos |

Lighthouse simula un 4G lento; el LCP real, en local, es de ~300 ms.

## Correrlo en local

Requisitos: Node 24 (`.nvmrc`).

```bash
npm install
cp .env.example .env.local        # opcional: NEXT_PUBLIC_SITE_URL
npm run dev                       # http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `npm run build` y `npm start` | Build de producción y servidor, como en el deploy |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Las 13 pruebas, contra el build de producción (la primera vez: `npx playwright install chromium`) |
| `npm run og` | Regenera `public/og/`. Si cambian el nombre o los tags del hero, hay que correrlo y commitear las imágenes: no se regeneran solas |
| `npm run screenshots` | Regenera las capturas de este README en `docs/screenshots/` |

`NEXT_PUBLIC_SITE_URL` es la URL pública (canonical, sitemap, robots, JSON-LD). Sin ella, en Vercel se usa el dominio de producción del proyecto y en local `http://localhost:3000`.

## Estructura

```
app/[lang]/       layout (metadata, JSON-LD) y página; /es y /en se generan en el build
app/sitemap.ts    sitemap y robots.ts, con las reglas para previews
components/       una sección, un componente
content/          textos y datos bilingües tipados: perfil, proyectos, atletismo, SEO
lib/              i18n, URL del sitio, JSON-LD, tema
next.config.ts    headers de seguridad y CSP
public/og/        imagen para redes, una por idioma
scripts/          imagen OG y capturas, con Chromium
tests/            pruebas de humo con Playwright
```
