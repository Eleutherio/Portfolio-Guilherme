import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imageGroups = [
  {
    directory: path.join(repositoryRoot, "src", "assets", "about"),
    widths: [200, 240, 320, 400, 480, 640, 800],
    sources: [
      ["grengame-presentation-portrait.jpg", "grengame-presentation-portrait"],
      ["hardware-workbench.jpg", "hardware-workbench"],
      ["unisinos-campus.jpg", "unisinos-campus"],
    ],
    avifQuality: 50,
    webpQuality: 78,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "projects"),
    widths: [400, 800],
    sources: [
      ["grengame-cover.webp", "grengame-cover"],
      ["abriu-chaveiro-cover.webp", "abriu-chaveiro-cover"],
      ["martha-izabel-cover.webp", "martha-izabel-cover"],
    ],
    avifQuality: 62,
    webpQuality: 82,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "testimonials"),
    widths: [96],
    sources: [
      ["alecsandra-klatt-martins.jpg", "alecsandra-klatt-martins"],
      ["bruna-vizzotto.jpg", "bruna-vizzotto"],
      ["leonardo-alvarez-pereira-gomes.jpg", "leonardo-alvarez-pereira-gomes"],
      ["martha-izabel.jpg", "martha-izabel"],
      ["tainara-conrad-bassani.jpg", "tainara-conrad-bassani"],
    ],
    avifQuality: 55,
    webpQuality: 76,
  },
];

let generatedCount = 0;

for (const group of imageGroups) {
  await mkdir(group.directory, { recursive: true });

  for (const [inputName, outputName] of group.sources) {
    const input = path.join(group.directory, inputName);

    for (const width of group.widths) {
      const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });

      await Promise.all([
        pipeline
          .clone()
          .avif({ quality: group.avifQuality, effort: 5 })
          .toFile(path.join(group.directory, `${outputName}-${width}w.avif`)),
        pipeline
          .clone()
          .webp({ quality: group.webpQuality, effort: 5 })
          .toFile(path.join(group.directory, `${outputName}-${width}w.webp`)),
      ]);
      generatedCount += 2;
    }
  }
}

console.log(`Generated ${generatedCount} responsive image variants.`);
