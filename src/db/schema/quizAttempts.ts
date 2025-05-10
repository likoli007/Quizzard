import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';

import { quizzes } from './quizzes';
import { users } from './users';

export const quizAttempts = sqliteTable('quiz_attempts', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	quizId: text('quiz_id')
		.notNull()
		.references(() => quizzes.id),
	score: integer('score'),
	timeSpent: integer('time_spent'),
	startedAt: text('started_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	completedAt: text('completed_at')
});

export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
	user: one(users, { fields: [quizAttempts.userId], references: [users.id] }),
	quiz: one(quizzes, {
		fields: [quizAttempts.quizId],
		references: [quizzes.id]
	})
}));

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export const createQuizAttemptValidator = z.object({
	userId: z.string(),
	quizId: z.string()
});
export type CreateQuizAttemptInput = z.infer<typeof createQuizAttemptValidator>;
