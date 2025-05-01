import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

import { users } from './users';

export const userPrefs = sqliteTable('user_prefs', {
	userId: text('user_id')
		.primaryKey()
		.references(() => users.id),
	theme: text('theme').notNull(),
	notificationsEnabled: integer('notifications_enabled', { mode: 'boolean' })
		.notNull()
		.default(true)
});

export type UserPrefs = typeof userPrefs.$inferSelect;
export const createUserPrefsValidator = z.object({
	userId: z.string(),
	theme: z.string(),
	notificationsEnabled: z.boolean()
});
export type CreateUserPrefsInput = z.infer<typeof createUserPrefsValidator>;
