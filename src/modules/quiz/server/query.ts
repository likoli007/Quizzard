import 'server-only';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { quizzes } from '@/db/schema/quizzes';
import { quizAttempts } from '@/db/schema/quizAttempts';
import {
	multipleChoiceQuestions,
	trueFalseQuestions
} from '@/db/schema/questions';

import { type QuizWithDetails } from './types';

export const getQuizWithDetails = async (
	quizId: string,
	userId: string
): Promise<QuizWithDetails | undefined> => {
	const quizRow = await db
		.select({
			id: quizzes.id,
			title: quizzes.title,
			description: quizzes.description,
			timeLimit: quizzes.timeLimit,
			topicId: quizzes.topicId,
			userId: quizzes.userId,
			createdAt: quizzes.createdAt,
			updatedAt: quizzes.updatedAt
		})
		.from(quizzes)
		.where(and(eq(quizzes.userId, userId), eq(quizzes.id, quizId)))
		.limit(1)
		.get();

	if (!quizRow) return;

	const attempts = await db
		.select({
			id: quizAttempts.id,
			userId: quizAttempts.userId,
			quizId: quizAttempts.quizId,
			score: quizAttempts.score,
			timeSpent: quizAttempts.timeSpent,
			startedAt: quizAttempts.startedAt,
			completedAt: quizAttempts.completedAt
		})
		.from(quizAttempts)
		.where(and(eq(quizzes.userId, userId), eq(quizAttempts.quizId, quizId)))
		.orderBy(desc(quizAttempts.startedAt));

	const tfQuestions = await db
		.select({
			id: trueFalseQuestions.id,
			quizId: trueFalseQuestions.quizId,
			questionText: trueFalseQuestions.questionText,
			order: trueFalseQuestions.order,
			createdAt: trueFalseQuestions.createdAt,
			updatedAt: trueFalseQuestions.updatedAt
		})
		.from(trueFalseQuestions)
		.where(eq(trueFalseQuestions.quizId, quizId))
		.orderBy(trueFalseQuestions.order);

	const mcQuestions = await db
		.select({
			id: multipleChoiceQuestions.id,
			quizId: multipleChoiceQuestions.quizId,
			questionText: multipleChoiceQuestions.questionText,
			order: multipleChoiceQuestions.order,
			options: multipleChoiceQuestions.options,
			createdAt: multipleChoiceQuestions.createdAt,
			updatedAt: multipleChoiceQuestions.updatedAt
		})
		.from(multipleChoiceQuestions)
		.where(eq(multipleChoiceQuestions.quizId, quizId))
		.orderBy(multipleChoiceQuestions.order);

	return {
		...quizRow,
		attempts,
		trueFalseQuestions: tfQuestions,
		multipleChoiceQuestions: mcQuestions
	};
};

export const getUserQuizzesWithDetails = async (
	userId: string,
	limit?: number
): Promise<QuizWithDetails[]> => {
	const userQuizzes = await db
		.select({
			id: quizzes.id,
			title: quizzes.title,
			description: quizzes.description,
			timeLimit: quizzes.timeLimit,
			topicId: quizzes.topicId,
			userId: quizzes.userId,
			createdAt: quizzes.createdAt,
			updatedAt: quizzes.updatedAt
		})
		.from(quizzes)
		.limit(limit ?? 0)
		.where(eq(quizzes.userId, userId));

	const detailed = await Promise.all(
		userQuizzes.map(async q => getQuizWithDetails(q.id, userId))
	);

	return detailed.filter((d): d is QuizWithDetails => !!d);
};
