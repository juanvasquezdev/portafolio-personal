import ArrowUpRight from "./ArrowUpRight";
import type { Projects } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * A la izquierda, fija, el título con un índice que lleva a cada tarjeta; a la
 * derecha, las tarjetas pasando. Al pasar el mouse por una, las demás bajan de
 * opacidad (solo CSS).
 *
 * La tarjeta es un enlace si el repo es público o si hay una demo pública. Sin
 * ninguno de los dos es un <article> y no lleva flecha: no promete un clic que
 * no lleva a ningún lado.
 */
export default function Proyectos({ content }: { content: Localized<Projects> }) {
  return (
    <section className="section" id="proyectos">
      <div className="wrap projects">
        <div className="proj-side">
          <p className="mono eyebrow sec-num" data-reveal>{content.eyebrow}</p>
          <h2 className="h2" data-reveal>
            {content.heading}
          </h2>
          <p className="intro">{content.intro}</p>
          <ol className="index mono">
            {content.items.map((project, i) => (
              <li key={project.slug}>
                <a href={`#proyecto-${project.slug}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="bar" aria-hidden="true" />
                  <span>{project.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="proj-list">
          {content.items.map((project) => {
            const href = project.repoUrl ?? project.demoUrl;
            const destino = project.repoUrl
              ? "GitHub"
              : project.demoUrl
                ? content.demoLabel
                : content.privateRepoLabel;
            const body = (
              <>
                <div className="card-top mono">
                  <span className="status">
                    <span className={project.live ? "dot" : "dot b"} aria-hidden="true" />
                    {project.statusLabel}
                  </span>
                  <span>{destino}</span>
                </div>
                <h3>
                  {project.title}
                  {href && <ArrowUpRight />}
                </h3>
                <p className="p">{project.problem}</p>
                <p className="s">{project.solution}</p>
                <ul className="chip-list chips">
                  {project.stack.map((tech) => (
                    <li className="chip sm" key={tech}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </>
            );

            const id = `proyecto-${project.slug}`;
            return href ? (
              <a
                className="card"
                data-reveal
                id={id}
                key={project.slug}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {body}
              </a>
            ) : (
              <article className="card" id={id} key={project.slug} data-reveal>
                {body}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
