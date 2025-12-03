import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FeedbackAction, mapErrorToMessage, successMessage } from './messages';

type Toast = { id: number; type: 'success' | 'error'; message: string } | null;

type FeedbackApi = {
  showSuccess: (action: FeedbackAction, args?: { path?: string }) => void;
  showError: (action: FeedbackAction, raw?: string) => string;
  toast: Toast;
  clearToast: () => void;
};

const FeedbackContext = createContext<FeedbackApi | null>(null);

let toastCounter = 0;

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Toast>(null);

  const clearToast = () => setToast(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const api = useMemo<FeedbackApi>(() => ({
    showSuccess(action, args) {
      toastCounter += 1;
      setToast({ id: toastCounter, type: 'success', message: successMessage(action, args) });
    },
    showError(action, raw) {
      const message = mapErrorToMessage(action, raw);
      toastCounter += 1;
      setToast({ id: toastCounter, type: 'error', message });
      return message;
    },
    toast,
    clearToast,
  }), [toast]);

  return <FeedbackContext.Provider value={api}>{children}</FeedbackContext.Provider>;
};

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used within FeedbackProvider');
  return ctx;
};
