import { useState } from 'react';
import { exportBackup } from '../lib/storage/backup';

type Toast = { type: 'success' | 'error'; message: string } | null;

export const BackupControls = () => {
  const [toast, setToast] = useState<Toast>(null);
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setBusy(true);
    setToast(null);
    const result = await exportBackup();
    if (result.ok) {
      setToast({ type: 'success', message: `Backup saved to ${result.data.path}` });
    } else {
      setToast({ type: 'error', message: result.error });
    }
    setBusy(false);
  };

  return (
    <section className="card" aria-label="Backup controls">
      <div className="list-header-bar" style={{ alignItems: 'center' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Data safety</p>
          <h2 style={{ margin: 0 }}>Export snapshot</h2>
          <p className="help" style={{ margin: 0 }}>Writes users, bookings, lastUpdated to data/backup with timestamped name.</p>
        </div>
        <button data-testid="export-backup" onClick={handleExport} disabled={busy}>
          {busy ? 'Exporting…' : 'Export backup'}
        </button>
      </div>
      {toast && (
        <div
          className={`toast ${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
          data-testid="backup-toast"
        >
          {toast.message}
        </div>
      )}
    </section>
  );
};
