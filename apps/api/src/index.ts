import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { HarbourSummaryEnvelope } from "@harbourwatch/shared";

const app = new Hono();

const placeholderSummary: HarbourSummaryEnvelope = {
  audience: "terminal",
  generatedAt: "1970-01-01T00:00:00.000Z",
  summary: "Adapter scaffold can resolve the shared HarbourWatch contract.",
  conditionSignals: [],
  panels: [],
  sources: []
};

app.notFound((c) =>
  c.json(
    {
      message: placeholderSummary.summary
    },
    404
  )
);

if (import.meta.url === `file://${process.argv[1]}`) {
  serve({
    fetch: app.fetch,
    port: 8787
  });
}

export { app };
