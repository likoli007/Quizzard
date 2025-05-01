import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';

import { quizAttempts } from './quizAttempts';
import { multipleChoiceQuestions, trueFalseQuestions } from './questions';

export const quizAnswers = sqliteTable('quiz_answers', {
	id: text('id').primaryKey(),
	quizAttemptId: text('quiz_attempt_id')
		.notNull()
		.references(() => quizAttempts.id),
	questionId: text('question_id').notNull(),
	selectedAnswer: integer('answer').notNull(),
	isCorrect: integer('is_correct', { mode: 'boolean' })
		.notNull()
		.default(false),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
	attempt: one(quizAttempts, {
		fields: [quizAnswers.quizAttemptId],
		references: [quizAttempts.id]
	}),
	trueFalseQuestion: one(trueFalseQuestions, {
		fields: [quizAnswers.questionId],
		references: [trueFalseQuestions.id]
	}),
	multipleChoiceQuestion: one(multipleChoiceQuestions, {
		fields: [quizAnswers.questionId],
		references: [multipleChoiceQuestions.id]
	})
}));

export type QuizAnswer = typeof quizAnswers.$inferSelect;

export const createQuizAnswerValidator = z
	.object({
		quizAttemptId: z.string(),
		questionId: z.string(),
		answer: z.union([z.boolean(), z.number(), z.string()])
	})
	.transform(data => ({
		...data,
		answer: JSON.stringify(data.answer)
	}));

export type CreateQuizAnswerInput = z.infer<typeof createQuizAnswerValidator>;
