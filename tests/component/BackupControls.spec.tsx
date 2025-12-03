import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackupControls } from '../../src/components/BackupControls';
import * as backupModule from '../../src/lib/storage/backup';

describe('BackupControls', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows success toast with path', async () => {
    vi.spyOn(backupModule, 'exportBackup').mockResolvedValue({
      ok: true,
      data: { path: 'data/backup/backup-20251203-101112.json' },
    });

    render(<BackupControls />);
    await userEvent.click(screen.getByTestId('export-backup'));

    await waitFor(() => {
      expect(screen.getByTestId('backup-toast')).toHaveTextContent('backup-20251203-101112.json');
    });
  });

  it('shows error toast on failure', async () => {
    vi.spyOn(backupModule, 'exportBackup').mockResolvedValue({ ok: false, error: 'Permission denied' });

    render(<BackupControls />);
    await userEvent.click(screen.getByTestId('export-backup'));

    await waitFor(() => {
      expect(screen.getByTestId('backup-toast')).toHaveTextContent('Permission denied');
    });
  });
});
