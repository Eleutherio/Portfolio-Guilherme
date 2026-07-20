import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          { ok: false, code: "method_not_allowed" },
          {
            status: 405,
            headers: {
              allow: "POST",
              "cache-control": "no-store",
              "x-content-type-options": "nosniff",
            },
          },
        ),
      POST: async ({ request }) => {
        const { handleContactRequest } = await import("@/lib/contact-handler.server");
        return handleContactRequest(request);
      },
    },
  },
});
