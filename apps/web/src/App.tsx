import type { HarbourSummaryEnvelope } from "@harbourwatch/shared";

const placeholderSummary: HarbourSummaryEnvelope = {
  audience: "visitor",
  generatedAt: "1970-01-01T00:00:00.000Z",
  summary: "HarbourWatch scaffold is ready for later board stories.",
  conditionSignals: [],
  panels: [],
  sources: []
};

export function App() {
  return (
    <main>
      <h1>HarbourWatch</h1>
      <p>{placeholderSummary.summary}</p>
    </main>
  );
}
