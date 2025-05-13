import 'server-only';
import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { quizzes } from '@/db/schema/quizzes';
import { quizAttempts } from '@/db/schema/quizAttempts';
import {
	multipleChoiceQuestions,
	trueFalseQuestions
} from '@/db/schema/questions';

import { QuizWithDetailsAndAnswers, type QuizWithDetails } from './types';
import { quizKeyEntries } from '@/db/schema/quizKeys';

export async function getTopicQuizzes(topicId: string) {
	return db
		.select({
			id: quizzes.id,
			title: quizzes.title,
			description: quizzes.description,
			timeLimit: quizzes.timeLimit,
			createdAt: quizzes.createdAt,
			updatedAt: quizzes.updatedAt
		})
		.from(quizzes)
		.where(and(eq(quizzes.topicId, topicId), eq(quizzes.deleted, 0)))
		.orderBy(desc(quizzes.createdAt));
}

export async function getAllQuizzes() {
	const allQuizzes = await db
		.select()
		.from(quizzes)
		.where(sql`${quizzes.deleted} = 0`);

	const result = await Promise.all(
		allQuizzes.map(async quiz => {
			const [tfCountResult] = await db
				.select({ count: sql<number>`count(*)` })
				.from(trueFalseQuestions)
				.where(sql`${trueFalseQuestions.quizId} = ${quiz.id}`);

			const [mcCountResult] = await db
				.select({ count: sql<number>`count(*)` })
				.from(multipleChoiceQuestions)
				.where(sql`${multipleChoiceQuestions.quizId} = ${quiz.id}`);

			return {
				...quiz,
				trueFalseCount: tfCountResult.count,
				multipleChoiceCount: mcCountResult.count
			};
		})
	);

	return result;
}

export async function getQuizDetailsWithoutAttempts(
	quizId: string,
	userId: string
) {
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
		trueFalseQuestions: tfQuestions,
		multipleChoiceQuestions: mcQuestions
	};
}

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

export const getQuizWithDetailsAndAnswers = async (
	quizId: string
): Promise<QuizWithDetailsAndAnswers | undefined> => {
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
		.where(eq(quizzes.id, quizId))
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
		.where(eq(quizAttempts.quizId, quizId))
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

	const keys = await db
		.select({
			questionId: quizKeyEntries.questionId,
			answerValue: quizKeyEntries.answerValue
		})
		.from(quizKeyEntries)
		.where(eq(quizKeyEntries.quizId, quizId));

	const answerKey = Object.fromEntries(
		keys.map(k => [k.questionId, JSON.parse(k.answerValue)])
	);

	return {
		...quizRow,
		attempts,
		trueFalseQuestions: tfQuestions,
		multipleChoiceQuestions: mcQuestions,
		answers: answerKey
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
