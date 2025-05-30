import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { type z } from 'zod';

import {
	type createTopicValidator,
	type updateTopicValidator
} from '@/app/server-actions/topics/validators';

import { favorites } from './favorites';
import { quizzes } from './quizzes';
import { users } from './users';

export const topics = sqliteTable('topics', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	readTime: text('read_time').notNull(),
	content: text('content').notNull(),
	category: text('category').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	deleted: integer('deleted')
		.notNull()
		.default(sql`0`),
	publishedAt: text('published_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const topicsRelations = relations(topics, ({ one, many }) => ({
	author: one(users, { fields: [topics.userId], references: [users.id] }),
	favorites: many(favorites),
	quizzes: many(quizzes)
}));

export type Topic = typeof topics.$inferSelect;

export type CreateTopicInput = z.infer<typeof createTopicValidator>;
export type UpdateTopicInput = z.infer<typeof updateTopicValidator>;
