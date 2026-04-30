export type Audience = "terminal" | "harbour-office" | "visitor";

export type SignalState = "fresh" | "stale" | "unavailable" | "fixture";

export type SourceKind = "noaa" | "nws" | "wsf" | "socrata" | "fixture" | "local";

export type PanelKind =
  | "summary"
  | "condition"
  | "tide"
  | "weather"
  | "ferry"
  | "notices"
  | "sourceContext";

export type ValidityWindow = {
  startsAt?: string;
  endsAt?: string;
};

export type SourceMetadata = {
  label: string;
  kind: SourceKind;
  state: SignalState;
  freshness: string;
  updatedAt?: string;
  validFor?: ValidityWindow;
  fixtureLabel?: string;
};

export type PanelState = {
  kind: PanelKind;
  state: SignalState;
  title: string;
  source: SourceMetadata;
  message?: string;
  value?: string;
};

export type ConditionSignal = {
  label: string;
  state: SignalState;
  message: string;
};

export type HarbourSummaryEnvelope = {
  audience: Audience;
  generatedAt: string;
  summary: string;
  conditionSignals: ConditionSignal[];
  panels: PanelState[];
  sources: SourceMetadata[];
};
