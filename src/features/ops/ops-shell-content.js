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
    intro: "Prepare the next local actions before later stories add live recovery controls.",
  }),
]);

export const OPS_ACTION_GROUPS = Object.freeze([
  Object.freeze({
    heading: "Current maintenance view",
    actions: Object.freeze(["Open readiness status", "Review data freshness"]),
  }),
  Object.freeze({
    heading: "Next recovery tools",
    actions: Object.freeze(["Review fallback state", "Prepare manual refresh"]),
  }),
]);
