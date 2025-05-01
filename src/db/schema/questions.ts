import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';

import { quizzes } from './quizzes';
import { quizKeyEntries } from './quizKeys';

export const trueFalseQuestions = sqliteTable('true_false_questions', {
	id: text('id').primaryKey(),
	quizId: text('quiz_id')
		.notNull()
		.references(() => quizzes.id),
	questionText: text('question_text').notNull(),
	order: integer('order').notNull(),
	createdAt: text('created_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

export const multipleChoiceQuestions = sqliteTable(
	'multiple_choice_questions',
	{
		id: text('id').primaryKey(),
		quizId: text('quiz_id')
			.notNull()
			.references(() => quizzes.id),
		questionText: text('question_text').notNull(),
		order: integer('order').notNull(),
		options: text('options')
			.notNull()
			.default(sql`'[]'`)
			.$type<string[]>(), // this might have to be changed, dont know if sqlite supports arrays
		createdAt: text('created_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at')
			.notNull()
			.default(sql`CURRENT_TIMESTAMP`)
	}
);

export const trueFalseRelations = relations(
	trueFalseQuestions,
	({ one, many }) => ({
		quiz: one(quizzes, {
			fields: [trueFalseQuestions.quizId],
			references: [quizzes.id]
		}),
		keyEntries: many(quizKeyEntries)
	})
);

export const multipleChoiceRelations = relations(
	multipleChoiceQuestions,
	({ one, many }) => ({
		quiz: one(quizzes, {
			fields: [multipleChoiceQuestions.quizId],
			references: [quizzes.id]
		}),
		keyEntries: many(quizKeyEntries)
	})
);

export type TrueFalseQuestion = typeof trueFalseQuestions.$inferSelect;
export type MultipleChoiceQuestion =
	typeof multipleChoiceQuestions.$inferSelect;

export type CreateTrueFalseQuestionInput = z.infer<
	typeof createTrueFalseQuestionValidator
>;

export type CreateMultipleChoiceQuestionInput = z.infer<
	typeof createMultipleChoiceQuestionValidator
>;

export const createMultipleChoiceQuestionValidator = z.object({
	quizId: z.string(),
	questionText: z.string(),
	order: z.coerce.number().int(),
	options: z.array(z.string()).min(1)
});

export const createTrueFalseQuestionValidator = z.object({
	quizId: z.string(),
	questionText: z.string(),
	order: z.coerce.number().int()
});
