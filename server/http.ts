const JSON_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
} as const;

export function json(data: unknown, status = 200, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

export async function readJsonBody(request: Request, maximumBytes = 4096): Promise<unknown> {
  const declared = Number.parseInt(request.headers.get("content-length") ?? "", 10);
  if (Number.isFinite(declared) && declared > maximumBytes) throw new Error("body_too_large");

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maximumBytes) throw new Error("body_too_large");
  return JSON.parse(body) as unknown;
}
