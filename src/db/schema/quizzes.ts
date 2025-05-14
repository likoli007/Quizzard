import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';

import { topics } from './topics';
import { quizAttempts } from './quizAttempts';
import { quizKeyEntries } from './quizKeys';
import { multipleChoiceQuestions, trueFalseQuestions } from './questions';
import { users } from './users';

export const quizzes = sqliteTable('quizzes', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	timeLimit: integer('time_limit').notNull(),
	topicId: text('topic_id')
		.notNull()
		.references(() => topics.id),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	deleted: integer('deleted')
		.notNull()
		.default(sql`0`)
});

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
	topic: one(topics, { fields: [quizzes.topicId], references: [topics.id] }),
	author: one(users, { fields: [quizzes.userId], references: [users.id] }),
	attempts: many(quizAttempts),
	key: one(quizKeyEntries, {
		fields: [quizzes.id],
		references: [quizKeyEntries.quizId]
	}),
	trueFalseQuestions: many(trueFalseQuestions),
	multipleChoiceQuestions: many(multipleChoiceQuestions)
}));

export type Quiz = typeof quizzes.$inferSelect;
export const createQuizValidator = z.object({
	title: z.string(),
	description: z.string().optional(),
	timeLimit: z.coerce.number().int(),
	topicId: z.string(),
	userId: z.string()
});
export type CreateQuizInput = z.infer<typeof createQuizValidator>;
