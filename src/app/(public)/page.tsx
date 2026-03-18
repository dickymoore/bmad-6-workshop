import { getPublicDisplayShellContent } from "@/features/display-shell/presenter";

export default function PublicDisplayPage() {
  const content = getPublicDisplayShellContent();

  return (
    <main className="shell-page">
      <section className="shell-card" aria-labelledby="display-shell-title">
        <p className="shell-kicker">{content.venueLabel}</p>
        <h1 className="shell-title" id="display-shell-title">
          {content.title}
        </h1>
        <p className="shell-copy">{content.summary}</p>
        <div className="shell-meta">
          <div>
            <strong>Format:</strong> {content.formatLabel}
          </div>
          <div>
            <strong>Interaction:</strong> {content.interactionLabel}
          </div>
        </div>
      </section>
    </main>
  );
}
