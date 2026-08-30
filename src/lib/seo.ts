export const SITE_ORIGIN = "https://guifer.tech";

export const absoluteSiteUrl = (path = "/") => new URL(path, `${SITE_ORIGIN}/`).href;
