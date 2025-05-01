import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';

import { quizzes } from './quizzes';
import { multipleChoiceQuestions, trueFalseQuestions } from './questions';

export const quizKeyEntries = sqliteTable('quiz_key_entries', {
	id: text('id').primaryKey(),
	quizId: text('quiz_id')
		.notNull()
		.references(() => quizzes.id),
	questionId: text('question_id').notNull(),
	answerValue: text('answer_value').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const quizKeyEntriesRelations = relations(quizKeyEntries, ({ one }) => ({
	quiz: one(quizzes, {
		fields: [quizKeyEntries.quizId],
		references: [quizzes.id]
	}),
	trueFalseQuestion: one(trueFalseQuestions, {
		fields: [quizKeyEntries.questionId],
		references: [trueFalseQuestions.id]
	}),
	multipleChoiceQuestion: one(multipleChoiceQuestions, {
		fields: [quizKeyEntries.questionId],
		references: [multipleChoiceQuestions.id]
	})
}));

export type QuizKeyEntry = typeof quizKeyEntries.$inferSelect;

export const createQuizKeyEntryValidator = z.object({
	quizId: z.string(),
	questionId: z.string(),
	answerValue: z.string()
});
export type CreateQuizKeyEntryInput = z.infer<
	typeof createQuizKeyEntryValidator
>;
