import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontVariables } from "../fonts";
import { LOCALES } from "@/content/types";
import { OG_IMAGE_SIZE, SEO } from "@/content/seo";
import { localize, toLocale } from "@/lib/i18n";
import { personJsonLd, serializeJsonLd } from "@/lib/json-ld";
import { isIndexable, languageAlternates, siteUrl } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "../globals.css";

type Props = { params: Promise<{ lang: string }> };

// Todo lo relativo (canonical, hreflang, og:url, la imagen) se completa contra
// metadataBase. Las dos páginas son estáticas, así que esto corre una vez por
// idioma en el build y lo que ve el buscador ya está en el <head>.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLocale((await params).lang);
  const seo = localize(SEO, lang);
  const image = { url: seo.ogImage.src, alt: seo.ogImage.alt, ...OG_IMAGE_SIZE };

  return {
    metadataBase: siteUrl(),
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `/${lang}`,
      languages: languageAlternates(),
    },
    // Las previews de Vercel no se indexan: acá y en app/robots.ts.
    ...(isIndexable() ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      type: "profile",
      url: `/${lang}`,
      siteName: seo.person.name,
      locale: seo.ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => SEO.ogLocale[l]),
      title: seo.title,
      description: seo.description,
      images: [{ ...image, type: "image/jpeg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [image],
    },
  };
}

// El color de la barra del navegador en el celular sigue al tema del sistema
// (mismos valores que --bg en globals.css).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0D0E10" },
    { media: "(prefers-color-scheme: light)", color: "#F3F2EE" },
  ],
};

// /es y /en se generan una vez en el build y se sirven estáticas. Con
// dynamicParams = false no existe ningún otro idioma: /xx da 404 directo (lo
// dibuja app/global-not-found.tsx) en vez de intentar renderizarse.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode } & Props>) {
  const lang = toLocale((await params).lang);

  // suppressHydrationWarning: el script del <head> puede poner data-theme en
  // <html> antes de que React hidrate, y ese atributo no está en el HTML del
  // servidor. Solo aplica a los atributos de <html>, no a sus hijos.
  // El JSON-LD es un bloque de datos, no código: el navegador no lo ejecuta y
  // la CSP no lo mira.
  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd(lang)) }}
        />
      </head>
      <body>
        {children}
        {/* Vercel Web Analytics. En producción carga /_vercel/insights/script.js
            y manda las visitas a /_vercel/insights/view: mismo origen, la CSP
            no se toca. En dev el paquete pide un script de va.vercel-scripts.com
            que la CSP bloquea, así que ahí no lo monto. Sin cookies ni eventos
            propios (el plan Hobby no los tiene). */}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
