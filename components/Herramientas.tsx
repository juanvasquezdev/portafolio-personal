import ArrowUpRight from "./ArrowUpRight";
import type { Tools } from "@/content/types";
import type { Localized } from "@/lib/i18n";

const GITHUB_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8 5 5 0 0 0 19.9 1S18.7.6 16 2.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A5 5 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.7c0 5.5 3.3 6.6 6.4 7a3.4 3.4 0 0 0-.9 2.6V22" />
  </svg>
);

/**
 * Herramientas chicas que corren en el navegador. Recibe solo las que ya
 * tienen repo publicado; si no hay ninguna, app/[lang]/page.tsx no la monta
 * (ni su link en el nav).
 *
 * La tarjeta no es un enlace: lleva dos (abrir y ver el código) y un <a> no
 * puede ir dentro de otro. Cada uno dice en su nombre accesible a qué
 * herramienta lleva, porque leídos sueltos serían ocho "Abrir" iguales.
 */
export default function Herramientas({ content }: { content: Localized<Tools> }) {
  return (
    <section className="section tools-section" id="herramientas">
      <div className="wrap">
        <div className="tools-head">
          <div>
            <p className="mono eyebrow sec-num" data-reveal>{content.eyebrow}</p>
            <h2 className="h2 h2-sm" data-reveal>
              {content.heading}
            </h2>
          </div>
          <div className="tools-aside">
            <p className="intro">{content.intro}</p>
            <a
              className="tools-cta mono"
              href={content.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.cta}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <ul className="tools">
          {content.items.map((tool) => (
            <li key={tool.repoUrl}>
              <article className="tool">
                <span className="mono tool-kind">{tool.kind}</span>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <div className="tool-links mono">
                  {tool.liveUrl && (
                    <a
                      href={tool.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={content.open.ariaLabel.replace("{name}", tool.name)}
                    >
                      {content.open.label}
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                  <a
                    href={tool.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={content.code.ariaLabel.replace("{name}", tool.name)}
                  >
                    {GITHUB_ICON}
                    {content.code.label}
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
