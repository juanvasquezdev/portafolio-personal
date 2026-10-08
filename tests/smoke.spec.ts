import { test, expect, type Page } from "@playwright/test";

// Pruebas de humo: la página es contenido estático, así que acá reviso que
// cargue en los dos idiomas, que lo poco interactivo responda y que no se rompa
// lo básico. Corren contra el build de producción (ver playwright.config.ts).

const LANGS = ["es", "en"] as const;

/**
 * Abre la página y espera a que React hidrate. Sin eso, un click cae sobre HTML
 * muerto y la prueba falla por timing, no por un bug.
 *
 * La señal: el botón de tema llega del servidor diciendo "cambiar a claro"
 * (asume oscuro) y React lo corrige al hidratar. Con el sistema en claro, el
 * label pasa a "cambiar a oscuro" solo cuando ya hay JS corriendo.
 */
async function abrir(page: Page, path: string) {
  await page.emulateMedia({ colorScheme: "light" });
  const response = await page.goto(path);
  await expect(page.locator(".theme-toggle")).toHaveAttribute(
    "aria-label",
    /modo oscuro|dark mode/
  );
  return response;
}

/** Baja hasta el final para que carguen las imágenes lazy y lo que dependa del scroll. */
async function recorrer(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 20));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle");
}

// ---------------------------------------------------------------------------
// Carga
// ---------------------------------------------------------------------------

test("las dos versiones del sitio cargan, con su título y en su idioma", async ({ page }) => {
  for (const lang of LANGS) {
    const response = await page.goto(`/${lang}`);

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("quien entra por la raíz llega a la versión en español", async ({ request }) => {
  // maxRedirects: 0 para ver la redirección en sí y no la página a la que lleva.
  const response = await request.get("/", { maxRedirects: 0 });

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toBe("/es");
});

test("una dirección que no existe muestra una página de error y no una en blanco", async ({ page }) => {
  const response = await page.goto("/es/no-existe");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("ninguno de los dos idiomas deja errores en la consola ni violaciones de CSP", async ({ page }) => {
  // La CSP de estilos va sin 'unsafe-inline' y depende del hash del style="" de
  // next/image (ver next.config.ts). Si Next lo cambia, esto se pone rojo.
  const errores: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errores.push(msg.text());
  });
  page.on("pageerror", (err) => errores.push(err.message));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      console.error(`CSP: ${e.effectiveDirective} ${e.blockedURI || "inline"}`);
    });
  });

  for (const lang of LANGS) {
    await abrir(page, `/${lang}`);
    await recorrer(page);
  }

  expect(errores).toEqual([]);
});

test("en un celular la página no se desborda hacia los lados", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/es");
  await page.waitForLoadState("networkidle");

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

// ---------------------------------------------------------------------------
// Lo interactivo
// ---------------------------------------------------------------------------

test("el botón de tema cambia el tema y la elección sobrevive a recargar", async ({ page }) => {
  await abrir(page, "/es");
  const html = page.locator("html");
  const boton = page.locator(".theme-toggle");

  // El sistema está en claro y todavía no se eligió nada.
  await expect(html).not.toHaveAttribute("data-theme", /.+/);
  await boton.click();

  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(boton).toHaveAttribute("aria-label", "Cambiar a modo claro");
  // Que el atributo cambie no alcanza: el fondo tiene que ser el del oscuro.
  await expect(html).toHaveCSS("background-color", "rgb(13, 14, 16)");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
});

test("el cambio de idioma lleva a la otra versión y conserva la sección (#hash)", async ({ page }) => {
  await abrir(page, "/es#contacto");
  await page.getByRole("group", { name: "Idioma" }).getByRole("link", { name: "EN" }).click();

  await expect(page).toHaveURL(/\/en#contacto$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  // Y de vuelta.
  await expect(page.locator(".theme-toggle")).toHaveAttribute("aria-label", /dark mode/);
  await page.getByRole("group", { name: "Language" }).getByRole("link", { name: "ES" }).click();
  await expect(page).toHaveURL(/\/es#contacto$/);
});

test("los filtros de la trayectoria muestran un año, las mejores marcas y vuelven a todos", async ({
  page,
}) => {
  await abrir(page, "/es");
  const filtros = page.getByRole("group", { name: "Trayectoria" });
  const años = page.locator(".results .ryear");

  const todos = await años.allTextContents();
  expect(todos.length).toBeGreaterThan(1);
  const [, anterior] = todos; // un año que no es el primero

  await filtros.getByRole("button", { name: anterior }).click();
  await expect(filtros.getByRole("button", { name: anterior })).toHaveAttribute("aria-pressed", "true");
  await expect(años).toHaveText([anterior]);

  await filtros.getByRole("button", { name: "Mejor por temporada" }).click();
  await expect(page.locator(".results")).toHaveCount(0);
  await expect(page.locator(".bars .bar-col")).toHaveCount(todos.length);

  await filtros.getByRole("button", { name: "Todos" }).click();
  await expect(años).toHaveText(todos);
});

test("los enlaces de contacto apuntan a donde dicen y los externos abren aparte sin opener", async ({
  page,
}) => {
  await page.goto("/es");
  const enlaces = page.locator("#contacto .contact-list a");
  await expect(enlaces).toHaveCount(4);

  const datos = await enlaces.evaluateAll((as: HTMLAnchorElement[]) =>
    as.map((a) => ({ href: a.getAttribute("href")!, target: a.target, rel: a.rel }))
  );
  const [email, ...externos] = datos;
  expect(email.href).toMatch(/^mailto:.+@.+/);
  expect(email.target).toBe("");
  expect(externos.map((l) => new URL(l.href).hostname)).toEqual([
    "github.com",
    "www.linkedin.com",
    "instagram.com",
  ]);

  // En toda la página, no solo en contacto: todo lo que abre en otra pestaña
  // va con noopener y noreferrer.
  const nuevaPestaña = await page.locator('a[target="_blank"]').evaluateAll((as: HTMLAnchorElement[]) => ({
    total: as.length,
    sinRel: as
      .filter((a) => !(a.relList.contains("noopener") && a.relList.contains("noreferrer")))
      .map((a) => a.getAttribute("href")),
  }));
  expect(nuevaPestaña.total).toBeGreaterThanOrEqual(externos.length);
  expect(nuevaPestaña.sinRel).toEqual([]);
});

test("Herramientas se ve en los dos idiomas, con sus 8 tarjetas y los enlaces a donde dicen", async ({
  page,
}) => {
  const sitio = "https://juanvasquez-herramientas.vercel.app";
  const repo = "https://github.com/juanvasquezdev/herramientas/tree/main/apps";

  for (const lang of LANGS) {
    await page.goto(`/${lang}`);
    const seccion = page.locator("#herramientas");
    await seccion.scrollIntoViewIfNeeded();
    await expect(seccion).toBeVisible();

    await expect(seccion.locator(".tools-cta")).toHaveAttribute("href", sitio);

    const tarjetas = seccion.locator(".tool");
    await expect(tarjetas).toHaveCount(8);

    // Por el nombre accesible y no por el texto: así también reviso que diga a
    // qué herramienta lleva.
    const primera = tarjetas.first();
    const nombre = lang === "es" ? "Análisis de salto en video" : "Jump video analysis";
    const [abrir, codigo] =
      lang === "es"
        ? [`Abrir ${nombre}`, `Ver código de ${nombre}`]
        : [`Open ${nombre}`, `View code for ${nombre}`];
    await expect(primera.getByRole("link", { name: abrir, exact: true })).toHaveAttribute(
      "href",
      `${sitio}/biomecanica`
    );
    await expect(primera.getByRole("link", { name: codigo, exact: true })).toHaveAttribute(
      "href",
      `${repo}/biomecanica`
    );
  }
});

// ---------------------------------------------------------------------------
// Movimiento reducido
// ---------------------------------------------------------------------------

test("con movimiento reducido, el nombre y el comienzo de cada sección se leen sin esperar", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  // networkidle para leer después de hidratar: antes de eso todo viene visible
  // del servidor y la prueba pasaría aunque el reveal escondiera algo.
  await page.waitForLoadState("networkidle");

  const { secciones, invisibles } = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll("main section"));
    const textos = [document.querySelector("h1"), ...sections.map((s) => s.querySelector("p"))];

    // La opacidad no se hereda en getComputedStyle: si el que está en 0 es un
    // contenedor, el párrafo igual dice 1. Por eso multiplico la de todos los
    // ancestros, que es la que se ve de verdad.
    const ocultos = textos.filter((el) => {
      let opacidad = 1;
      for (let nodo: HTMLElement | null = el; nodo; nodo = nodo.parentElement) {
        opacidad *= Number(getComputedStyle(nodo).opacity);
      }
      return el !== null && opacidad < 1;
    });

    return {
      secciones: sections.length,
      invisibles: ocultos.map((el) => el!.textContent!.trim().slice(0, 60)),
    };
  });

  expect(secciones).toBeGreaterThan(0);
  expect(invisibles).toEqual([]);
});

test("con movimiento reducido, nada de lo marcado con data-reveal queda transparente", async ({ page }) => {
  // Primero sin reducir: lo que anima al scroll es exactamente lo marcado. Si
  // alguien agrega una animación al CSS sin marcar el elemento, o marca uno que
  // el CSS no anima, esto lo avisa antes de que la segunda parte mire de menos.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/es");
  await page.waitForLoadState("networkidle");

  const marcados = await page.evaluate(() => {
    const anima = (el: Element) => getComputedStyle(el).animationName === "aparece";
    const conAtributo = Array.from(document.querySelectorAll("[data-reveal]"));
    return {
      total: conAtributo.length,
      sinAnimacion: conAtributo.filter((el) => !anima(el)).map((el) => el.className),
      animanSinMarca: Array.from(document.querySelectorAll("body *"))
        .filter((el) => anima(el) && !el.hasAttribute("data-reveal"))
        .map((el) => el.className),
    };
  });
  expect(marcados.total).toBeGreaterThan(0);
  expect(marcados.sinAnimacion).toEqual([]);
  expect(marcados.animanSinMarca).toEqual([]);

  // Con reduce: arriba de todo, lo marcado está debajo del pliegue, que es
  // justo donde quedaría en el `from` (opacity 0) si la animación no se apagara.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.waitForLoadState("networkidle");

  const transparentes = await page.locator("[data-reveal]").evaluateAll((els) =>
    els
      .filter((el) => Number(getComputedStyle(el).opacity) < 1)
      .map((el) => `${el.className}: ${el.textContent!.trim().slice(0, 40)}`)
  );
  expect(transparentes).toEqual([]);
});

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

test("cada idioma trae canonical, los tres hreflang, imagen para redes y JSON-LD válido", async ({
  page,
  request,
}) => {
  for (const lang of LANGS) {
    await page.goto(`/${lang}`);
    const head = page.locator("head");

    const canonical = await head.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(`/${lang}`);

    for (const hreflang of ["es", "en", "x-default"]) {
      await expect(head.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
    }

    // Que la etiqueta exista no alcanza: la imagen tiene que estar servida.
    const ogImage = await head.locator('meta[property="og:image"]').getAttribute("content");
    const image = await request.get(new URL(ogImage!).pathname);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toBe("image/jpeg");

    const jsonLd = await head.locator('script[type="application/ld+json"]').textContent();
    const person = JSON.parse(jsonLd!);
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBeTruthy();
  }
});
