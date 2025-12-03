import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackupControls } from '../../src/components/BackupControls';
import { ToastViewport } from '../../src/components/ToastViewport';
import * as backupModule from '../../src/lib/storage/backup';
import { FeedbackProvider } from '../../src/lib/feedback/context';

describe('BackupControls', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows success toast with path', async () => {
    vi.spyOn(backupModule, 'exportBackup').mockResolvedValue({
      ok: true,
      data: { path: 'data/backup/backup-20251203-101112.json' },
    });

    render(
      <FeedbackProvider>
        <BackupControls />
        <ToastViewport />
      </FeedbackProvider>,
    );
    await userEvent.click(screen.getByTestId('export-backup'));

    await waitFor(() => {
      expect(screen.getByTestId('feedback-toast')).toHaveTextContent('backup-20251203-101112.json');
    });
  });

  it('shows error toast on failure', async () => {
    vi.spyOn(backupModule, 'exportBackup').mockResolvedValue({ ok: false, error: 'Permission denied' });

    render(
      <FeedbackProvider>
        <BackupControls />
        <ToastViewport />
      </FeedbackProvider>,
    );
    await userEvent.click(screen.getByTestId('export-backup'));

    await waitFor(() => {
      expect(screen.getByTestId('feedback-toast')).toHaveTextContent('Permission denied');
      expect(screen.getByTestId('export-error')).toHaveTextContent('Permission denied');
    });
  });
});
