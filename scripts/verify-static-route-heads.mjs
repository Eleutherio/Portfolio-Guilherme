import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "dist", "client");
const origin = "https://guifer.tech";
const routes = [
  "/",
  "/sobre",
  "/privacidade",
  "/acessibilidade",
  "/projetos/grengame",
  "/projetos/abriu-chaveiro",
  "/projetos/martha-izabel",
];

function matches(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function one(html, pattern, label, route) {
  const values = matches(html, pattern);
  assert.equal(values.length, 1, `${route}: expected one ${label}, received ${values.length}`);
  assert.ok(values[0]?.trim(), `${route}: ${label} must not be empty`);
  return values[0];
}

for (const route of routes) {
  const file =
    route === "/"
      ? path.join(outputDirectory, "index.html")
      : path.join(outputDirectory, `${route.slice(1)}.html`);
  const html = await readFile(file, "utf8");
  const canonical = one(
    html,
    /<link data-static-head rel="canonical" href="([^"]+)">/g,
    "canonical",
    route,
  );
  const expectedUrl = new URL(route, `${origin}/`).href;

  assert.equal(canonical, expectedUrl, `${route}: canonical must use the production origin`);
  one(html, /<title>([^<]+)<\/title>/g, "title", route);
  one(html, /<meta data-static-head name="description" content="([^"]+)">/g, "description", route);
  assert.equal(
    one(html, /<meta data-static-head property="og:url" content="([^"]+)">/g, "og:url", route),
    expectedUrl,
  );

  for (const property of ["og:title", "og:description", "og:image", "og:image:alt"]) {
    const value = one(
      html,
      new RegExp(`<meta data-static-head property="${property}" content="([^"]+)">`, "g"),
      property,
      route,
    );
    if (property === "og:image") assert.match(value, /^https:\/\//, `${route}: ${property}`);
  }

  assert.equal(
    one(
      html,
      /<meta data-static-head name="twitter:card" content="([^"]+)">/g,
      "twitter:card",
      route,
    ),
    "summary_large_image",
  );
  for (const name of [
    "twitter:title",
    "twitter:description",
    "twitter:image",
    "twitter:image:alt",
  ]) {
    const value = one(
      html,
      new RegExp(`<meta data-static-head name="${name}" content="([^"]+)">`, "g"),
      name,
      route,
    );
    if (name === "twitter:image") assert.match(value, /^https:\/\//, `${route}: ${name}`);
  }
}

console.info(`Heads estáticos validados para ${routes.length} rotas.`);
