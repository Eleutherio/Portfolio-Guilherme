import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(repositoryRoot, "src");
const outputRoot = path.join(sourceRoot, "assets", "fonts");

async function collectSourceText(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const contents = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return collectSourceText(entryPath);
      if (!/\.(css|ts|tsx)$/.test(entry.name)) return "";
      return readFile(entryPath, "utf8");
    }),
  );
  return contents.join("");
}

const sourceText = await collectSourceText(sourceRoot);
const soraCharacters = [...new Set(sourceText)].join("");
const caveatCharacters = "Eu me chamo Guilherme Eleuthério.I'm ";

const fonts = [
  {
    input: path.join(
      repositoryRoot,
      "node_modules",
      "@fontsource-variable",
      "sora",
      "files",
      "sora-latin-wght-normal.woff2",
    ),
    output: "sora-heading-500.woff2",
    characters: soraCharacters,
    weight: 500,
  },
  {
    input: path.join(
      repositoryRoot,
      "node_modules",
      "@fontsource-variable",
      "caveat",
      "files",
      "caveat-latin-wght-normal.woff2",
    ),
    output: "caveat-signature-600.woff2",
    characters: caveatCharacters,
    weight: 600,
  },
  {
    input: path.join(
      repositoryRoot,
      "node_modules",
      "@fontsource-variable",
      "space-grotesk",
      "files",
      "space-grotesk-latin-wght-normal.woff2",
    ),
    output: "space-grotesk-body.woff2",
    characters: sourceText,
  },
];

await mkdir(outputRoot, { recursive: true });

for (const font of fonts) {
  const input = await readFile(font.input);
  const subset = await subsetFont(input, font.characters, {
    targetFormat: "woff2",
    ...(font.weight ? { variationAxes: { wght: font.weight } } : {}),
  });
  await writeFile(path.join(outputRoot, font.output), subset);
}

console.log(`Generated ${fonts.length} local WOFF2 font subsets.`);
