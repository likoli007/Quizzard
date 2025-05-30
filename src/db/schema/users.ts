import {
	integer,
	primaryKey,
	sqliteTable,
	text
} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { type AdapterAccountType } from '@auth/core/adapters';

import { userPrefs } from './userPrefs';
import { favorites } from './favorites';
import { topics } from './topics';
import { quizzes } from './quizzes';
import { quizAttempts } from './quizAttempts';

export const users = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name'),
	email: text('email'),
	emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
	image: text('image')
});

export const accounts = sqliteTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	account => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	})
);

export const sessions = sqliteTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
});

export const verificationTokens = sqliteTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
	},
	verificationToken => ({
		compositePk: primaryKey({
			columns: [verificationToken.identifier, verificationToken.token]
		})
	})
);

export const authenticators = sqliteTable(
	'authenticator',
	{
		credentialID: text('credentialID').notNull().unique(),
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		providerAccountId: text('providerAccountId').notNull(),
		credentialPublicKey: text('credentialPublicKey').notNull(),
		counter: integer('counter').notNull(),
		credentialDeviceType: text('credentialDeviceType').notNull(),
		credentialBackedUp: integer('credentialBackedUp', {
			mode: 'boolean'
		}).notNull(),
		transports: text('transports')
	},
	authenticator => ({
		compositePK: primaryKey({
			columns: [authenticator.userId, authenticator.credentialID]
		})
	})
);

export const usersRelations = relations(users, ({ one, many }) => ({
	prefs: one(userPrefs, { fields: [users.id], references: [userPrefs.userId] }),
	topics: many(topics),
	quizzes: many(quizzes),
	favorites: many(favorites),
	attempts: many(quizAttempts)
}));

export type User = typeof users.$inferSelect;
export const createUserValidator = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	passwordHash: z.string().min(6),
	avatarUrl: z.string().url().optional()
});
export type CreateUserInput = z.infer<typeof createUserValidator>;
