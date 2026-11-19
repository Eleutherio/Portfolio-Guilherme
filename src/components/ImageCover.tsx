import type { CSSProperties, ImgHTMLAttributes } from "react";

export type ResponsiveImage = {
  /** Optional AVIF srcset, including width or density descriptors. */
  avif?: string;
  /** Optional WebP srcset, including width or density descriptors. */
  webp?: string;
  /** Fallback URL used when no supported source matches. */
  fallback: string;
  /** Optional low-quality placeholder URL. */
  lqip?: string;
  /** Intrinsic width */
  width: number;
  /** Intrinsic height */
  height: number;
};

type Props = {
  image: ResponsiveImage;
  /** Higher-quality source set for desktop layouts. */
  desktopImage?: ResponsiveImage;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  fetchPriority?: "high" | "low" | "auto";
} & Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes" | "loading">;

/**
 * Image with optional responsive sources and explicit intrinsic dimensions.
 * Source elements are emitted only when a real srcset is available.
 */
export function ImageCover({
  image,
  desktopImage,
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
      {desktopImage?.avif && (
        <source
          media="(min-width: 64rem)"
          type="image/avif"
          srcSet={desktopImage.avif}
          sizes={sizes}
        />
      )}
      {desktopImage?.webp && (
        <source
          media="(min-width: 64rem)"
          type="image/webp"
          srcSet={desktopImage.webp}
          sizes={sizes}
        />
      )}
      {desktopImage && (
        <source media="(min-width: 64rem)" srcSet={desktopImage.fallback} sizes={sizes} />
      )}
      {image.avif && <source type="image/avif" srcSet={image.avif} sizes={sizes} />}
      {image.webp && <source type="image/webp" srcSet={image.webp} sizes={sizes} />}
      <img
        {...imgProps}
        src={image.fallback}
        alt={alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={fetchPriority}
        className={imgClassName}
        style={style}
      />
    </picture>
  );
}
