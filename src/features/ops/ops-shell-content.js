export const OPS_SHELL_SECTIONS = Object.freeze([
  Object.freeze({
    id: "ops-summary",
    heading: "Venue operations",
    intro:
      "Use this local maintenance surface to review readiness and prepare recovery steps without changing the public display.",
  }),
  Object.freeze({
    id: "ops-system-checks",
    heading: "System checks",
    intro: "Review current readiness, data freshness, and fallback posture in a stable keyboard order.",
  }),
  Object.freeze({
    id: "ops-recovery-steps",
    heading: "Recovery steps",
    intro: "Run the light maintenance checks here while keeping the public display isolated from direct control.",
  }),
]);

export const OPS_RECOVERY_STEPS = Object.freeze([
  "Confirm the public display remains unchanged before any maintenance action.",
  "Review readiness and calm issue wording in this local surface.",
  "Run a refresh or trust check only from this local maintenance area.",
]);

export const OPS_READINESS_STATES = Object.freeze({
  current: "Current",
  "reduced-confidence": "Reduced confidence",
  unavailable: "Unavailable",
});
