export const SITE_ORIGIN = "https://guifer.tech";
export const SOCIAL_IMAGE_WIDTH = 1200;
export const SOCIAL_IMAGE_HEIGHT = 630;

export const absoluteSiteUrl = (path = "/") => new URL(path, `${SITE_ORIGIN}/`).href;

export const socialImageMeta = (path: string) => {
  const url = absoluteSiteUrl(path);

  return [
    { property: "og:image", content: url },
    { property: "og:image:secure_url", content: url },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:width", content: String(SOCIAL_IMAGE_WIDTH) },
    { property: "og:image:height", content: String(SOCIAL_IMAGE_HEIGHT) },
    { name: "twitter:image", content: url },
  ];
};
