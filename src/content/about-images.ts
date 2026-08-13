import campus320Avif from "@/assets/about/unisinos-campus-320w.avif";
import campus640Avif from "@/assets/about/unisinos-campus-640w.avif";
import campus800Avif from "@/assets/about/unisinos-campus-800w.avif";
import campusFallback from "@/assets/about/unisinos-campus.jpg";
import campus320Webp from "@/assets/about/unisinos-campus-320w.webp";
import campus640Webp from "@/assets/about/unisinos-campus-640w.webp";
import campus800Webp from "@/assets/about/unisinos-campus-800w.webp";
import featured320Avif from "@/assets/about/grengame-presentation-portrait-320w.avif";
import featured640Avif from "@/assets/about/grengame-presentation-portrait-640w.avif";
import featured800Avif from "@/assets/about/grengame-presentation-portrait-800w.avif";
import featuredFallback from "@/assets/about/grengame-presentation-portrait.jpg";
import featured320Webp from "@/assets/about/grengame-presentation-portrait-320w.webp";
import featured640Webp from "@/assets/about/grengame-presentation-portrait-640w.webp";
import featured800Webp from "@/assets/about/grengame-presentation-portrait-800w.webp";
import workbench320Avif from "@/assets/about/hardware-workbench-320w.avif";
import workbench640Avif from "@/assets/about/hardware-workbench-640w.avif";
import workbench800Avif from "@/assets/about/hardware-workbench-800w.avif";
import workbenchFallback from "@/assets/about/hardware-workbench.jpg";
import workbench320Webp from "@/assets/about/hardware-workbench-320w.webp";
import workbench640Webp from "@/assets/about/hardware-workbench-640w.webp";
import workbench800Webp from "@/assets/about/hardware-workbench-800w.webp";
import type { ResponsiveImage } from "@/components/ImageCover";

const srcSet = (sources: Array<[string, number]>) =>
  sources.map(([source, width]) => `${source} ${width}w`).join(", ");

export const aboutFeaturedImage: ResponsiveImage = {
  avif: srcSet([
    [featured320Avif, 320],
    [featured640Avif, 640],
    [featured800Avif, 800],
  ]),
  webp: srcSet([
    [featured320Webp, 320],
    [featured640Webp, 640],
    [featured800Webp, 800],
  ]),
  fallback: featuredFallback,
  width: 800,
  height: 1000,
};

export const aboutWorkbenchImage: ResponsiveImage = {
  avif: srcSet([
    [workbench320Avif, 320],
    [workbench640Avif, 640],
    [workbench800Avif, 800],
  ]),
  webp: srcSet([
    [workbench320Webp, 320],
    [workbench640Webp, 640],
    [workbench800Webp, 800],
  ]),
  fallback: workbenchFallback,
  width: 800,
  height: 1000,
};

export const aboutCampusImage: ResponsiveImage = {
  avif: srcSet([
    [campus320Avif, 320],
    [campus640Avif, 640],
    [campus800Avif, 800],
  ]),
  webp: srcSet([
    [campus320Webp, 320],
    [campus640Webp, 640],
    [campus800Webp, 800],
  ]),
  fallback: campusFallback,
  width: 800,
  height: 1000,
};
