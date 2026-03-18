import { AtmosphericHeader } from "@/features/dashboard/components/AtmosphericHeader";

type ReservedSection = {
  title: string;
  variant: string;
};

type DashboardViewModel = {
  placeLabel: string;
  overallState: string;
  stateKicker: string;
  stateHeadline: string;
  weatherSummary: string;
  mobilitySummary: string;
  freshnessLabel: string;
  supportLabel: string;
  reservedSections: readonly ReservedSection[];
};

export function DashboardScreen({ viewModel }: { viewModel: DashboardViewModel }) {
  return (
    <main className="dashboard-page">
      <div className="dashboard-backdrop" aria-hidden="true" />
      <section className="dashboard-shell" aria-label="Royal Institution departure picture">
        <AtmosphericHeader viewModel={viewModel} />

        <div className="dashboard-lower-grid" aria-label="Reserved display structure">
          {viewModel.reservedSections.map((section) => (
            <section
              key={section.title}
              className={`dashboard-reserved dashboard-reserved--${section.variant}`}
              aria-label={section.title}
            >
              <p className="dashboard-reserved__label">{section.title}</p>
              <div className="dashboard-reserved__surface" aria-hidden="true" />
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
