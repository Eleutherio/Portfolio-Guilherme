import campus200Avif from "@/assets/about/unisinos-campus-200w.avif";
import campus240Avif from "@/assets/about/unisinos-campus-240w.avif";
import campus320Avif from "@/assets/about/unisinos-campus-320w.avif";
import campus400Avif from "@/assets/about/unisinos-campus-400w.avif";
import campus480Avif from "@/assets/about/unisinos-campus-480w.avif";
import campus640Avif from "@/assets/about/unisinos-campus-640w.avif";
import campus800Avif from "@/assets/about/unisinos-campus-800w.avif";
import campusFallback from "@/assets/about/unisinos-campus.jpg";
import campus200Webp from "@/assets/about/unisinos-campus-200w.webp";
import campus240Webp from "@/assets/about/unisinos-campus-240w.webp";
import campus320Webp from "@/assets/about/unisinos-campus-320w.webp";
import campus400Webp from "@/assets/about/unisinos-campus-400w.webp";
import campus480Webp from "@/assets/about/unisinos-campus-480w.webp";
import campus640Webp from "@/assets/about/unisinos-campus-640w.webp";
import campus800Webp from "@/assets/about/unisinos-campus-800w.webp";
import featured200Avif from "@/assets/about/grengame-presentation-portrait-200w.avif";
import featured240Avif from "@/assets/about/grengame-presentation-portrait-240w.avif";
import featured320Avif from "@/assets/about/grengame-presentation-portrait-320w.avif";
import featured400Avif from "@/assets/about/grengame-presentation-portrait-400w.avif";
import featured480Avif from "@/assets/about/grengame-presentation-portrait-480w.avif";
import featured640Avif from "@/assets/about/grengame-presentation-portrait-640w.avif";
import featured800Avif from "@/assets/about/grengame-presentation-portrait-800w.avif";
import featuredFallback from "@/assets/about/grengame-presentation-portrait.jpg";
import featured200Webp from "@/assets/about/grengame-presentation-portrait-200w.webp";
import featured240Webp from "@/assets/about/grengame-presentation-portrait-240w.webp";
import featured320Webp from "@/assets/about/grengame-presentation-portrait-320w.webp";
import featured400Webp from "@/assets/about/grengame-presentation-portrait-400w.webp";
import featured480Webp from "@/assets/about/grengame-presentation-portrait-480w.webp";
import featured640Webp from "@/assets/about/grengame-presentation-portrait-640w.webp";
import featured800Webp from "@/assets/about/grengame-presentation-portrait-800w.webp";
import workbench200Avif from "@/assets/about/hardware-workbench-200w.avif";
import workbench240Avif from "@/assets/about/hardware-workbench-240w.avif";
import workbench320Avif from "@/assets/about/hardware-workbench-320w.avif";
import workbench400Avif from "@/assets/about/hardware-workbench-400w.avif";
import workbench480Avif from "@/assets/about/hardware-workbench-480w.avif";
import workbenchFallback from "@/assets/about/hardware-workbench-home.jpg";
import workbench200Webp from "@/assets/about/hardware-workbench-200w.webp";
import workbench240Webp from "@/assets/about/hardware-workbench-240w.webp";
import workbench320Webp from "@/assets/about/hardware-workbench-320w.webp";
import workbench400Webp from "@/assets/about/hardware-workbench-400w.webp";
import workbench480Webp from "@/assets/about/hardware-workbench-480w.webp";
import type { ResponsiveImage } from "@/components/ImageCover";

const srcSet = (sources: Array<[string, number]>) =>
  sources.map(([source, width]) => `${source} ${width}w`).join(", ");

export const aboutFeaturedImage: ResponsiveImage = {
  avif: srcSet([
    [featured200Avif, 200],
    [featured240Avif, 240],
    [featured320Avif, 320],
    [featured400Avif, 400],
    [featured480Avif, 480],
    [featured640Avif, 640],
    [featured800Avif, 800],
  ]),
  webp: srcSet([
    [featured200Webp, 200],
    [featured240Webp, 240],
    [featured320Webp, 320],
    [featured400Webp, 400],
    [featured480Webp, 480],
    [featured640Webp, 640],
    [featured800Webp, 800],
  ]),
  fallback: featuredFallback,
  width: 800,
  height: 1000,
};

export const aboutWorkbenchImage: ResponsiveImage = {
  avif: srcSet([
    [workbench200Avif, 200],
    [workbench240Avif, 240],
    [workbench320Avif, 320],
    [workbench400Avif, 400],
    [workbench480Avif, 480],
  ]),
  webp: srcSet([
    [workbench200Webp, 200],
    [workbench240Webp, 240],
    [workbench320Webp, 320],
    [workbench400Webp, 400],
    [workbench480Webp, 480],
  ]),
  fallback: workbenchFallback,
  width: 480,
  height: 600,
};

export const aboutCampusImage: ResponsiveImage = {
  avif: srcSet([
    [campus200Avif, 200],
    [campus240Avif, 240],
    [campus320Avif, 320],
    [campus400Avif, 400],
    [campus480Avif, 480],
    [campus640Avif, 640],
    [campus800Avif, 800],
  ]),
  webp: srcSet([
    [campus200Webp, 200],
    [campus240Webp, 240],
    [campus320Webp, 320],
    [campus400Webp, 400],
    [campus480Webp, 480],
    [campus640Webp, 640],
    [campus800Webp, 800],
  ]),
  fallback: campusFallback,
  width: 800,
  height: 1000,
};
