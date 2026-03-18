const publicDisplayShellContent = Object.freeze({
  venueLabel: "Royal Institution foyer",
  title: "Albemarle Pulse",
  summary:
    "A shared departure view for visitors leaving from the Royal Institution. The public screen stays calm, local, and non-interactive, holding space for nearby travel, weather, and trust cues without asking anyone to search or choose a route.",
  formatLabel: "Shared public display",
  interactionLabel: "No click, scroll, or search required",
});

const publicDisplayShellMetadata = Object.freeze({
  title: "Albemarle Pulse",
  description: "Royal Institution departure display shell",
});

export function getPublicDisplayShellContent() {
  return publicDisplayShellContent;
}

export function getPublicDisplayShellMetadata() {
  return publicDisplayShellMetadata;
}
