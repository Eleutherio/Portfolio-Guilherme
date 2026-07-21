import { isIP } from "node:net";

export type RequestContext = {
  peerAddress?: string | null;
};

export type ClientIpSource = "direct" | "render";

export class ClientAddressError extends Error {
  constructor() {
    super("Trusted client address unavailable");
    this.name = "ClientAddressError";
  }
}

function validAddress(value: string | null | undefined): string | null {
  const address = value?.trim();
  return address && isIP(address) !== 0 ? address : null;
}

function configuredSource(): ClientIpSource {
  const fallback = process.env.RENDER === "true" ? "render" : "direct";
  const source = (process.env.CLIENT_IP_SOURCE ?? fallback).trim().toLowerCase();
  if (source === "direct" || source === "render") return source;
  throw new ClientAddressError();
}

export function resolveClientAddress(
  request: Request,
  context: RequestContext,
  source: ClientIpSource = configuredSource(),
): string {
  if (source === "direct") {
    const address = validAddress(context.peerAddress);
    if (address) return address;
    throw new ClientAddressError();
  }

  // Render prepends the real client address. Values after the first entry may
  // have been supplied by an upstream client and must never select a bucket.
  const firstForwardedAddress = request.headers.get("x-forwarded-for")?.split(",", 1)[0];
  const address = validAddress(firstForwardedAddress);
  if (address) return address;
  throw new ClientAddressError();
}
