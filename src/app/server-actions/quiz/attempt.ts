'use server';

import { v4 as uuid } from 'uuid';
import { db } from '@/db';
import { quizAttempts, createQuizAttemptValidator } from '@/db/schema/quizAttempts';

export async function createQuizAttempt(raw: { quizId: string; userId?: string }) {
	const { userId = 'temp', quizId } = raw;

	const { userId: u, quizId: q } = createQuizAttemptValidator.parse({
		userId,
		quizId
	});

	const attemptId = uuid();
	const now = new Date().toISOString();

	await db.insert(quizAttempts).values({
		id: attemptId,
		userId: u,
		quizId: q,
		score: 0,
		timeSpent: 0,
		startedAt: now,
		completedAt: null
	});

	return { attemptId };
}
