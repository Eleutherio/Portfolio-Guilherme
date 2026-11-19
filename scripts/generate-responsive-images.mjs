import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const onlyOutputName = process.argv
  .find((argument) => argument.startsWith("--only="))
  ?.slice("--only=".length);
const imageGroups = [
  {
    directory: path.join(repositoryRoot, "src", "assets", "hero"),
    widths: [480, 800, 960, 1200],
    sources: [["guilherme-speaking.jpg", "guilherme-speaking"]],
    avifQuality: 45,
    webpQuality: 70,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "about"),
    widths: [200, 240, 320, 400, 480, 640, 800],
    sources: [
      ["grengame-presentation-portrait.jpg", "grengame-presentation-portrait"],
      [
        "hardware-workbench.jpg",
        "hardware-workbench",
        {
          extract: { left: 160, top: 200, width: 480, height: 600 },
          widths: [200, 240, 320, 400, 480],
          fallback: { outputName: "hardware-workbench-home.jpg", quality: 82 },
        },
      ],
      ["unisinos-campus.jpg", "unisinos-campus"],
    ],
    avifQuality: 54,
    webpQuality: 78,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "about"),
    widths: [480, 512, 720, 960],
    sources: [["about-speaking-cutout.png", "about-speaking-cutout"]],
    avifQuality: 30,
    webpQuality: 78,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "about"),
    widths: [240, 400, 640],
    sources: [
      ["about-mosaic-classroom.jpg", "about-mosaic-classroom"],
      ["about-mosaic-kit.jpg", "about-mosaic-kit"],
      ["about-mosaic-campus.jpg", "about-mosaic-campus"],
      ["about-mosaic-cat.jpg", "about-mosaic-cat"],
    ],
    avifQuality: 50,
    webpQuality: 74,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "projects"),
    widths: [400, 600, 800, 1200, 1600],
    sources: [
      ["grengame-cover.webp", "grengame-cover"],
      ["abriu-chaveiro-cover.webp", "abriu-chaveiro-cover"],
      ["martha-izabel-cover.webp", "martha-izabel-cover"],
    ],
    avifQuality: 28,
    webpQuality: 82,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "projects"),
    widths: [400, 800, 1000, 1600],
    sources: [["grengame-cover.webp", "grengame-cover-grid"]],
    avifQuality: 50,
    webpQuality: 74,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "projects"),
    widths: [400, 600, 800, 1200],
    sources: [
      ["abriu-chaveiro-cover.webp", "abriu-chaveiro-cover-grid"],
      ["martha-izabel-cover.webp", "martha-izabel-cover-grid"],
    ],
    avifQuality: 34,
    webpQuality: 66,
  },
  {
    directory: path.join(repositoryRoot, "src", "assets", "testimonials"),
    widths: [96, 128, 192],
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

  for (const [inputName, outputName, transforms] of group.sources) {
    if (onlyOutputName && outputName !== onlyOutputName) continue;

    const input = path.join(group.directory, inputName);
    const widths = transforms?.widths ?? group.widths;

    if (transforms?.fallback) {
      const source = sharp(input).rotate();
      const pipeline = transforms.extract ? source.extract(transforms.extract) : source;
      await pipeline
        .jpeg({ quality: transforms.fallback.quality, mozjpeg: true })
        .toFile(path.join(group.directory, transforms.fallback.outputName));
      generatedCount += 1;
    }

    for (const width of widths) {
      const source = sharp(input).rotate();
      const pipeline = (transforms?.extract ? source.extract(transforms.extract) : source).resize({
        width,
        withoutEnlargement: true,
      });

      await Promise.all([
        pipeline
          .clone()
          .avif({ quality: group.avifQuality, effort: 8 })
          .toFile(path.join(group.directory, `${outputName}-${width}w.avif`)),
        pipeline
          .clone()
          .webp({ quality: group.webpQuality, effort: 6, smartSubsample: true })
          .toFile(path.join(group.directory, `${outputName}-${width}w.webp`)),
      ]);
      generatedCount += 2;
    }
  }
}

if (onlyOutputName && generatedCount === 0) {
  throw new Error(`No responsive image source found for "${onlyOutputName}".`);
}

console.log(`Generated ${generatedCount} responsive image variants.`);
