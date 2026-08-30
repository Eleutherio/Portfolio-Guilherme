import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "public", "social");
const width = 1200;
const height = 630;

const font = (
  await readFile(
    path.join(
      root,
      "node_modules",
      "@fontsource-variable",
      "space-grotesk",
      "files",
      "space-grotesk-latin-wght-normal.woff2",
    ),
  )
).toString("base64");

const fontFace = `
  @font-face {
    font-family: 'Space Grotesk';
    src: url(data:font/woff2;base64,${font}) format('woff2');
    font-weight: 300 700;
  }
`;

const wordmark = `
  <g transform="translate(76 68)">
    <circle cx="24" cy="24" r="24" fill="#f2efe8" />
    <text x="24" y="31" text-anchor="middle" font-size="20" font-weight="700" fill="#172033">gui</text>
    <text x="48" y="32" font-size="30" font-weight="700" fill="#f2efe8">fer</text>
    <text x="91" y="32" font-size="30" font-weight="300" fill="#f2efe8">.tech</text>
  </g>
`;

const svg = (content, extra = "") =>
  Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>${fontFace}</style>
      <pattern id="grid" width="44" height="44" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="#78a5ce" opacity="0.16" />
      </pattern>
      ${extra}
    </defs>
    <rect width="1200" height="630" fill="#0e131b" />
    <rect width="1200" height="630" fill="url(#grid)" />
    ${content}
  </svg>
`);

const institutional = svg(`
  ${wordmark}
  <rect x="76" y="220" width="72" height="4" rx="2" fill="#78a5ce" />
  <text x="76" y="315" font-family="Space Grotesk, sans-serif" font-size="70" font-weight="500" letter-spacing="-2" fill="#f2efe8">Portfólio pessoal</text>
  <text x="76" y="377" font-family="Space Grotesk, sans-serif" font-size="30" font-weight="300" fill="#a4acb7">software · produto · experiências digitais</text>
  <text x="76" y="556" font-family="Space Grotesk, sans-serif" font-size="20" font-weight="400" letter-spacing="5" fill="#78a5ce">GUIFER.TECH</text>
`);

const cases = [
  {
    slug: "grengame",
    title: "GrenGame",
    source: path.join(root, "src", "assets", "projects", "grengame-cover.webp"),
  },
  {
    slug: "abriu-chaveiro",
    title: "Abriu Chaveiro 24h",
    source: path.join(root, "src", "assets", "projects", "abriu-chaveiro-cover.webp"),
  },
  {
    slug: "martha-izabel",
    title: "Martha Izabel",
    source: path.join(root, "src", "assets", "projects", "martha-izabel-cover.webp"),
  },
];

await mkdir(outputDirectory, { recursive: true });
await sharp(institutional)
  .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
  .toFile(path.join(outputDirectory, "guifer-tech.jpg"));

for (const project of cases) {
  const cover = await sharp(project.source)
    .resize(width, height, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toBuffer();
  const overlay = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>${fontFace}</style>
        <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0e131b" stop-opacity="0.48" />
          <stop offset="0.48" stop-color="#0e131b" stop-opacity="0.18" />
          <stop offset="1" stop-color="#0e131b" stop-opacity="0.92" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)" />
      ${wordmark}
      <text x="76" y="520" font-family="Space Grotesk, sans-serif" font-size="64" font-weight="500" letter-spacing="-1.5" fill="#f2efe8">${project.title}</text>
      <text x="78" y="562" font-family="Space Grotesk, sans-serif" font-size="20" font-weight="400" letter-spacing="4" fill="#a3c2dd">CASE STUDY</text>
    </svg>
  `);

  await sharp(cover)
    .composite([{ input: overlay }])
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toFile(path.join(outputDirectory, `${project.slug}.jpg`));
}

console.log("Imagens sociais geradas em public/social.");
