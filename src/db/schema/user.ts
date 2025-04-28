import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { InferSelectModel, relations } from 'drizzle-orm';

import { gifts } from './gift';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	username: text('username').notNull().unique(),
	password: text('password').notNull(),
	role: text('role', { enum: ['santa', 'user'] }).notNull(),
	isLoggedIn: integer('isLoggedIn', { mode: 'boolean' })
		.notNull()
		.default(false)
});

export const usersRelations = relations(users, ({ many }) => ({
	gifts: many(gifts)
}));

export type User = InferSelectModel<typeof users>;
