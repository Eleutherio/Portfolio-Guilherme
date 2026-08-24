import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import { gzipSync } from "node:zlib";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const MAX_A_PLUS_BYTES = 272_510;
const TARGET_WITH_MARGIN_BYTES = 250_000;
const RESPONSE_OVERHEAD_BYTES = 500;
const EXTERNAL_FALLBACK_BYTES = 2_048;
const REPORT_LIMIT = Number.parseInt(process.env.CARBON_REPORT_LIMIT ?? "10", 10);
const DIST_ROOT = path.resolve("dist/client");
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".svg",
  ".txt",
  ".webmanifest",
  ".xml",
]);

if (!existsSync(path.join(DIST_ROOT, "index.html"))) {
  throw new Error("Build do frontend não encontrado em dist/client.");
}

function formatBytes(bytes) {
  return `${(bytes / 1_000).toFixed(1)} kB`;
}

function estimateLocalTransfer(filePath) {
  const contents = readFileSync(filePath);
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())
    ? gzipSync(contents, { level: 9 }).byteLength
    : contents.byteLength;
}

async function getAvailablePort() {
  const server = createServer();
  server.unref();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : null;
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  if (!port) throw new Error("Não foi possível reservar uma porta para o preview.");
  return port;
}

function resolveLocalFile(resourceUrl, baseUrl) {
  const url = new URL(resourceUrl);
  if (url.origin !== baseUrl) return null;

  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  const candidate = path.resolve(DIST_ROOT, relativePath);

  if (!candidate.startsWith(`${DIST_ROOT}${path.sep}`) && candidate !== DIST_ROOT) {
    throw new Error(`Recurso fora de dist/client: ${pathname}`);
  }

  return existsSync(candidate) ? candidate : path.join(DIST_ROOT, "index.html");
}

function uniqueResponses(responses) {
  const unique = new Map();
  for (const response of responses) {
    if (!response.url.startsWith("http")) continue;
    const key = new URL(response.url);
    key.search = "";
    unique.set(key.href, response);
  }
  return [...unique.values()];
}

function totalResources(resources) {
  const bodyBytes = resources.reduce((total, resource) => total + resource.bytes, 0);
  return bodyBytes + resources.length * RESPONSE_OVERHEAD_BYTES;
}

function measureResponses(responses, baseUrl) {
  const measuredResources = uniqueResponses(responses).map((response) => {
    const localFile = resolveLocalFile(response.url, baseUrl);
    const bytes = localFile
      ? estimateLocalTransfer(localFile)
      : Math.max(response.encodedBytes, EXTERNAL_FALLBACK_BYTES);
    return { url: response.url, type: response.type, status: response.status, bytes };
  });
  return {
    resources: measuredResources,
    totalBytes: totalResources(measuredResources),
  };
}

async function waitForPreview(server, baseUrl) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Preview encerrou antes de iniciar, código ${server.exitCode}.`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // O servidor ainda está iniciando.
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error("Timeout ao iniciar o preview do frontend.");
}

async function stopPreview(server) {
  if (server.exitCode !== null) return;
  server.kill();
  await Promise.race([once(server, "exit"), new Promise((resolve) => setTimeout(resolve, 3_000))]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

async function hydrateEntireDocument(page) {
  let previousHeight = 0;
  let stablePasses = 0;

  for (let pass = 0; pass < 20; pass += 1) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += 600) {
      await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
      await page.waitForTimeout(200);
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(750);

    const state = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      pendingSections: document.querySelectorAll("[data-deferred-section]").length,
      footerMounted: Boolean(document.querySelector("footer")),
    }));
    const complete = state.pendingSections === 0 && state.footerMounted;
    stablePasses = complete && state.height === previousHeight ? stablePasses + 1 : 0;
    previousHeight = state.height;

    if (stablePasses >= 2) return;
  }

  throw new Error("A rolagem integral não hidratou todas as seções e o rodapé.");
}

const port = await getAvailablePort();
const baseUrl = `http://127.0.0.1:${port}`;

const preview = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--strictPort",
  ],
  { cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
);

let previewError = "";
preview.stderr.on("data", (chunk) => {
  previewError += chunk.toString();
});

let browser;

try {
  await waitForPreview(preview, baseUrl);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1365, height: 768 },
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  const client = await context.newCDPSession(page);
  await client.send("Network.enable");

  const responses = new Map();
  client.on("Network.responseReceived", (event) => {
    responses.set(event.requestId, {
      url: event.response.url,
      type: event.type,
      status: event.response.status,
      encodedBytes: 0,
    });
  });
  client.on("Network.loadingFinished", (event) => {
    const response = responses.get(event.requestId);
    if (response) response.encodedBytes = event.encodedDataLength;
  });

  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForTimeout(1_000);
  const initialMeasurement = measureResponses(responses.values(), baseUrl);
  const initialWithoutMediaBytes = totalResources(
    initialMeasurement.resources.filter((response) => response.type !== "Media"),
  );

  await hydrateEntireDocument(page);
  await page.waitForTimeout(3_000);

  const fullMeasurement = measureResponses(responses.values(), baseUrl);
  const measuredResources = fullMeasurement.resources;
  const totalBytes = fullMeasurement.totalBytes;
  const mediaRequests = measuredResources.filter(
    (response) => response.type === "Media" && response.status < 400,
  );
  const largest = measuredResources
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, Number.isFinite(REPORT_LIMIT) ? REPORT_LIMIT : 10);

  console.log(`Carga fria inicial: ${formatBytes(initialMeasurement.totalBytes)}`);
  console.log(`Carga fria sem mídia automática: ${formatBytes(initialWithoutMediaBytes)}`);
  console.log(`Website Carbon A+: ${formatBytes(totalBytes)} / ${formatBytes(MAX_A_PLUS_BYTES)}`);
  console.log(`Meta interna com margem: ${formatBytes(TARGET_WITH_MARGIN_BYTES)}`);
  console.log(`Recursos contabilizados: ${measuredResources.length}`);
  console.table(
    largest.map((resource) => ({
      recurso: new URL(resource.url).pathname,
      tipo: resource.type,
      transferencia: formatBytes(resource.bytes),
    })),
  );

  const failures = [];
  if (mediaRequests.length > 0) {
    failures.push(
      `Foram carregados ${mediaRequests.length} vídeo(s) sem intenção explícita do usuário.`,
    );
  }
  if (totalBytes > MAX_A_PLUS_BYTES) {
    failures.push(`O orçamento excedeu A+ em ${formatBytes(totalBytes - MAX_A_PLUS_BYTES)}.`);
  }

  if (failures.length > 0) {
    throw new Error(failures.join(" "));
  }

  if (totalBytes > TARGET_WITH_MARGIN_BYTES) {
    console.warn("[AVISO] A+ aprovado, mas abaixo da margem interna contra variações de medição.");
  } else {
    console.log("[OK] Orçamento A+ aprovado com margem operacional.");
  }
} catch (error) {
  if (previewError.trim()) console.error(previewError.trim());
  console.error(`[ERRO] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await browser?.close();
  await stopPreview(preview);
}
