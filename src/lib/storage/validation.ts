import { getDeskIndex } from './desks-index';

export type ValidationResult = { ok: true } | { ok: false; error: string; code: 'INVALID_DESK' | 'DESK_MISMATCH' };

const deskIndex = getDeskIndex();

export const validateDesk = (office: string, floor: string, deskId: string): ValidationResult => {
  const mapping = deskIndex[deskId];
  if (!mapping) return { ok: false, error: 'deskId not found in desks.json', code: 'INVALID_DESK' };
  if (mapping.office !== office || mapping.floor !== floor) {
    return { ok: false, error: 'deskId does not belong to office/floor', code: 'DESK_MISMATCH' };
  }
  return { ok: true };
};
