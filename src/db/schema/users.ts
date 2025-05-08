import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';

import { userPrefs } from './userPrefs';
import { favorites } from './favorites';
import { quizAttempts } from './quizAttempts';
import { quizzes } from './quizzes';
import { topics } from './topics';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	passwordHash: text('password_hash').notNull(),
	avatarUrl: text('avatar_url'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const usersRelations = relations(users, ({ one, many }) => ({
	prefs: one(userPrefs, { fields: [users.id], references: [userPrefs.userId] }),
	//topics: many(topics), 	TODO: uncomment once users table is functional
	//quizzes: many(quizzes),	TODO: uncomment once users table is functional
	favorites: many(favorites)
	//attempts: many(quizAttempts)
}));

export type User = typeof users.$inferSelect;
export const createUserValidator = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	passwordHash: z.string().min(6),
	avatarUrl: z.string().url().optional()
});
export type CreateUserInput = z.infer<typeof createUserValidator>;
