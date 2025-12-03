import { useState } from 'react';
import { exportBackup, importBackup } from '../lib/storage/backup';
import { useFeedback } from '../lib/feedback/context';

export const BackupControls = () => {
  const { showSuccess, showError } = useFeedback();
  const [busy, setBusy] = useState(false);
  const [importBusy, setImportBusy] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

  const handleExport = async () => {
    setBusy(true);
    setExportError(null);
    const result = await exportBackup();
    if (result.ok) {
      showSuccess('backup.export', { path: result.data.path });
    } else {
      const msg = showError('backup.export', result.error);
      setExportError(msg);
    }
    setBusy(false);
  };

  const handleFileChange = (fileList: FileList | null) => {
    const file = fileList?.item(0) ?? null;
    setImportFile(file);
    setImportError(null);
    setExportError(null);
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportError('Choose a .json backup file to import.');
      return;
    }

    setImportBusy(true);
    setImportError(null);

    try {
      const raw = await importFile.text();
      let payload: unknown;
      try {
        payload = JSON.parse(raw);
      } catch (error: any) {
        setImportError('Backup file is not valid JSON.');
        showError('backup.import', 'invalid json');
        return;
      }

      const result = importBackup(payload);
      if (result.ok) {
        showSuccess('backup.import');
      } else {
        const msg = showError('backup.import', result.error);
        setImportError(msg);
      }
    } finally {
      setImportBusy(false);
    }
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
        {exportError && (
          <p className="help" style={{ color: '#b91c1c', marginTop: 8 }} data-testid="export-error">
            {exportError}
          </p>
        )}
      <div className="list-header-bar" style={{ alignItems: 'center', marginTop: 16 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Restore</p>
          <h3 style={{ margin: 0 }}>Import backup</h3>
          <p className="help" style={{ margin: 0 }}>Validates schema then replaces users/bookings atomically; creates temp backup for rollback.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            data-testid="import-backup-file"
            type="file"
            accept="application/json"
            onChange={(e) => handleFileChange(e.target.files)}
            aria-label="Choose backup file"
          />
          <button
            data-testid="import-backup-submit"
            onClick={handleImport}
            disabled={importBusy}
          >
            {importBusy ? 'Importing…' : 'Import backup'}
          </button>
        </div>
      </div>
      {importError && (
        <p className="help" style={{ color: '#b91c1c', marginTop: 8 }} data-testid="import-error">
          {importError}
        </p>
      )}
    </section>
  );
};
