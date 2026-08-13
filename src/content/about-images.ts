import featuredFallback from "@/assets/about/grengame-presentation-portrait.jpg";
import workbenchFallback from "@/assets/about/hardware-workbench.jpg";
import campusFallback from "@/assets/about/unisinos-campus.jpg";
import type { ResponsiveImage } from "@/components/ImageCover";

export const aboutFeaturedImage: ResponsiveImage = {
  fallback: featuredFallback,
  width: 800,
  height: 1000,
};

export const aboutWorkbenchImage: ResponsiveImage = {
  fallback: workbenchFallback,
  width: 800,
  height: 1000,
};

export const aboutCampusImage: ResponsiveImage = {
  fallback: campusFallback,
  width: 800,
  height: 1000,
};
