import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";

const root = cwd();
const read = (path) => readFileSync(join(root, path), "utf8");
const failures = [];

const sharedSource = read("packages/shared/src/index.ts");
const webSource = read("apps/web/src/App.tsx");
const apiSource = read("apps/api/src/index.ts");

for (const expected of [
  "Audience",
  "SignalState",
  "SourceKind",
  "PanelKind",
  "SourceMetadata",
  "PanelState",
  "HarbourSummaryEnvelope"
]) {
  if (!sharedSource.includes(`export type ${expected}`)) {
    failures.push(`Shared contract does not export ${expected}`);
  }
}

for (const rawProviderTerm of ["NOAA", "NWS", "WSF", "Socrata", "rawJson", "responsePayload"]) {
  if (sharedSource.includes(rawProviderTerm)) {
    failures.push(`Shared contract contains provider-shaped/raw term: ${rawProviderTerm}`);
  }
}

if (!webSource.includes('from "@harbourwatch/shared"')) {
  failures.push("Web package does not import the shared contract");
}

if (!apiSource.includes('from "@harbourwatch/shared"')) {
  failures.push("API package does not import the shared contract");
}

for (const source of [webSource, apiSource]) {
  for (const duplicatedType of ["type Audience", "type PanelState", "interface SourceMetadata", "interface HarbourSummaryEnvelope"]) {
    if (source.includes(duplicatedType)) {
      failures.push(`Runtime package duplicates shared type: ${duplicatedType}`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Story 1.1 boundary verification passed.");
