import type { CSSProperties, ImgHTMLAttributes } from "react";

type SrcSetEntry = { src: string; w: number };

export type ResponsiveImage = {
  /** AVIF variants generated at build time by vite-imagetools */
  avif?: string;
  /** WebP variants (or the default srcset) */
  webp?: string;
  /** Fallback single URL for width/height dimensions and legacy loaders */
  fallback: string;
  /** Tiny blurred data URL / URL used as low-quality image placeholder */
  lqip?: string;
  /** Intrinsic width */
  width: number;
  /** Intrinsic height */
  height: number;
};

type Props = {
  image: ResponsiveImage;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  fetchPriority?: "high" | "low" | "auto";
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes" | "loading">;

/**
 * Responsive image with AVIF/WebP srcsets, blur LQIP placeholder, and explicit
 * intrinsic dimensions to eliminate layout shift.
 */
export function ImageCover({
  image,
  alt,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  imgClassName,
  eager = false,
  fetchPriority,
  style,
  ...imgProps
}: Props) {
  const bgStyle: CSSProperties | undefined = image.lqip
    ? {
        backgroundImage: `url(${image.lqip})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <picture className={className} style={bgStyle}>
      {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
      <source type="image/webp" srcSet={image.webp} sizes={sizes} />
      <img
        {...imgProps}
        src={image.fallback}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        // @ts-expect-error React types lag behind DOM attribute
        fetchpriority={fetchPriority}
        className={imgClassName}
        style={style}
      />
    </picture>
  );
}
