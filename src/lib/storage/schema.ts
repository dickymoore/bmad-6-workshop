import { z } from 'zod';
import { getDeskIndex } from './desks-index';

const deskIndex = getDeskIndex();

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  active: z.boolean(),
});

export const UsersSchema = z.array(UserSchema);

export const BookingSchema = z.object({
  id: z.string().min(1),
  office: z.string().min(1),
  floor: z.string().min(1),
  deskId: z.string().min(1),
  date: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
  userId: z.string().min(1),
  createdAt: z.string().datetime({ offset: true }),
  releasedAt: z.string().datetime({ offset: true }).optional(),
}).superRefine((value, ctx) => {
  const mapping = deskIndex[value.deskId];
  if (!mapping) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'deskId not found in desks.json' });
    return;
  }
  if (mapping.office !== value.office || mapping.floor !== value.floor) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'deskId does not belong to office/floor' });
  }
});

export const BookingsSchema = z.array(BookingSchema);

const LastUpdatedSchema = z.union([
  z.object({ updatedAt: z.string().datetime({ offset: true }) }),
  z.string().datetime({ offset: true }),
]);

export const BackupSchema = z.object({
  users: UsersSchema,
  bookings: BookingsSchema,
  lastUpdated: LastUpdatedSchema,
  schemaVersion: z.string().optional(),
});
