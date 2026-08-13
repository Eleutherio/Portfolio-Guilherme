import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetDirectory = path.join(repositoryRoot, "src", "assets", "about");
const widths = [320, 640, 800];
const sourceNames = ["grengame-presentation-portrait", "hardware-workbench", "unisinos-campus"];

await mkdir(assetDirectory, { recursive: true });

for (const sourceName of sourceNames) {
  const input = path.join(assetDirectory, `${sourceName}.jpg`);

  for (const width of widths) {
    const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });

    await Promise.all([
      pipeline
        .clone()
        .avif({ quality: 55, effort: 5 })
        .toFile(path.join(assetDirectory, `${sourceName}-${width}w.avif`)),
      pipeline
        .clone()
        .webp({ quality: 78, effort: 5 })
        .toFile(path.join(assetDirectory, `${sourceName}-${width}w.webp`)),
    ]);
  }
}

console.log(
  `Generated ${sourceNames.length * widths.length * 2} responsive image variants in ${assetDirectory}`,
);
