import { isIP } from "node:net";
import { getServerEnvironment } from "./env";

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
  return getServerEnvironment().CLIENT_IP_SOURCE;
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

  // Render's Cloudflare edge overwrites this header. X-Forwarded-For is not
  // trusted because the edge appends to a value supplied by the client.
  const address = validAddress(request.headers.get("cf-connecting-ip"));
  if (address) return address;
  throw new ClientAddressError();
}
