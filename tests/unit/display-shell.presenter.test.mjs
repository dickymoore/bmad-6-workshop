import { describe, expect, it } from "vitest";

import {
  getPublicDisplayShellContent,
  getPublicDisplayShellMetadata,
} from "../../src/features/display-shell/presenter.js";

describe("public display shell presenter", () => {
  it("returns frozen contracts so later feature code cannot mutate shared display state", () => {
    const content = getPublicDisplayShellContent();
    const metadata = getPublicDisplayShellMetadata();

    expect(Object.isFrozen(content)).toBe(true);
    expect(Object.isFrozen(metadata)).toBe(true);
  });

  it("keeps the public display contract calm and local-first", () => {
    expect(getPublicDisplayShellContent()).toEqual({
      venueLabel: "Royal Institution foyer",
      title: "Albemarle Pulse",
      summary:
        "A shared departure view for visitors leaving from the Royal Institution. The public screen stays calm, local, and non-interactive, holding space for nearby travel, weather, and trust cues without asking anyone to search or choose a route.",
      formatLabel: "Shared public display",
      interactionLabel: "No click, scroll, or search required",
    });
  });

  it("keeps page metadata aligned with the calm foyer display intent", () => {
    expect(getPublicDisplayShellMetadata()).toEqual({
      title: "Albemarle Pulse",
      description: "Royal Institution departure display shell",
    });
  });
});
