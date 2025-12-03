import React from 'react';
import { useFeedback } from '../lib/feedback/context';

export const ToastViewport: React.FC = () => {
  const { toast, clearToast } = useFeedback();

  if (!toast) return null;

  return (
    <div
      className={`toast ${toast.type}`}
      data-testid="feedback-toast"
      role="status"
      tabIndex={0}
      style={{ outline: 'none' }}
      aria-live="polite"
    >
      <span>{toast.message}</span>
      <button aria-label="Close toast" onClick={clearToast} style={{ marginLeft: 8 }}>
        ×
      </button>
    </div>
  );
};
