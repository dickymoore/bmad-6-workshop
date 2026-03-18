export default function PublicDisplayPage() {
  return (
    <main className="shell-page">
      <section className="shell-card" aria-labelledby="display-shell-title">
        <p className="shell-kicker">Royal Institution foyer</p>
        <h1 className="shell-title" id="display-shell-title">
          Albemarle Pulse
        </h1>
        <p className="shell-copy">
          A shared departure view for visitors leaving from the Royal
          Institution. The public screen stays calm, local, and
          non-interactive, holding space for nearby travel, weather, and trust
          cues without asking anyone to search or choose a route.
        </p>
        <div className="shell-meta">
          <div>
            <strong>Format:</strong> Shared public display
          </div>
          <div>
            <strong>Interaction:</strong> No click, scroll, or search required
          </div>
        </div>
      </section>
    </main>
  );
}
