import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';

import { users } from './users';
import { favorites } from './favorites';
import { quizzes } from './quizzes';

export const topics = sqliteTable('topics', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	content: text('content').notNull(),
	category: text('category').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
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
export const createTopicValidator = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	content: z.string(),
	category: z.string(),
	readTime: z.coerce.number().int(),
	userId: z.string(),
	publishedAt: z.string().optional()
});
export type CreateTopicInput = z.infer<typeof createTopicValidator>;
