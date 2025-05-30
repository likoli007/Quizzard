'use server';

import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { quizAttempts } from '@/db/schema/quizAttempts';
import { quizAnswers } from '@/db/schema/quizAnswers';
import { quizKeyEntries } from '@/db/schema/quizKeys';
import { quizzes } from '@/db/schema/quizzes';

type RawInput = {
	quizId: string;
	userId: string;
	timeTaken: number;
	answers: { questionId: string; answer: boolean | number | null }[];
};

export const createQuizAttempt = async (
	raw: RawInput
): Promise<{ attemptId: string }> => {
	const { quizId, userId } = raw;

	const topicId = await db
		.select({ topicId: quizzes.topicId })
		.from(quizzes)
		.where(eq(quizzes.id, quizId));

	const keyRows = await db
		.select({
			questionId: quizKeyEntries.questionId,
			answerValue: quizKeyEntries.answerValue
		})
		.from(quizKeyEntries)
		.where(eq(quizKeyEntries.quizId, quizId));

	const keyMap = new Map(
		keyRows.map(r => [r.questionId, JSON.parse(r.answerValue)])
	);

	let correct = 0;
	const answerRows: (typeof quizAnswers.$inferInsert)[] = [];

	raw.answers.forEach(({ questionId, answer }) => {
		const correctAnswer = keyMap.get(questionId);
		const isCorrect = answer === correctAnswer;

		if (isCorrect) {
			correct += 1;
		}

		const selectedAnswer =
			answer === null
				? null
				: typeof answer === 'boolean'
					? answer
						? 1
						: 0
					: Number(answer);

		answerRows.push({
			id: uuid(),
			quizAttemptId: '',
			questionId,
			selectedAnswer,
			isCorrect
		});
	});
	const attemptId = uuid();
	const now = new Date().toISOString();

	await db.transaction(async tx => {
		await tx.insert(quizAttempts).values({
			id: attemptId,
			userId,
			quizId,
			score: correct,
			timeSpent: raw.timeTaken,
			startedAt: now,
			completedAt: now
		});

		await tx.insert(quizAnswers).values(
			answerRows.map(r => ({
				...r,
				quizAttemptId: attemptId
			}))
		);
	});

	revalidatePath(`/quiz/${quizId}/results`);
	revalidatePath(`/topic/${topicId}/leaderboard`);

	return { attemptId };
};
