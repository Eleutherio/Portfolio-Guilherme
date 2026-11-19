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
const dmSansCharacters = [...new Set(sourceText)].join("");

const fonts = [
  {
    input: path.join(
      repositoryRoot,
      "scripts",
      "assets",
      "fonts",
      "dm-sans-latin-wght-normal.woff2",
    ),
    output: "dm-sans-heading.woff2",
    characters: dmSansCharacters,
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
    variationAxes: {
      wght: {
        min: font.output === "dm-sans-heading.woff2" ? 400 : 300,
        max: font.output === "dm-sans-heading.woff2" ? 600 : 700,
      },
    },
  });
  await writeFile(path.join(outputRoot, font.output), subset);
}

console.log(`Generated ${fonts.length} local WOFF2 font subsets.`);
