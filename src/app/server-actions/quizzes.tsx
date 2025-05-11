'use server';

//import { v4 as uuidv4 } from 'uuid';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import {
	trueFalseQuestions,
	multipleChoiceQuestions
} from '@/db/schema/questions';
import { quizKeyEntries } from '@/db/schema/quizKeys';
import { quizzes } from '@/db/schema/quizzes';
import { createQuizSchema } from '@/modules/quiz/components/create-quiz-form/schema';

export const createTopicWithQuiz = async (
	rawData: unknown,
	userId: string
): Promise<{ quizId: string }> => {
	const data = createQuizSchema.parse(rawData);

	return db.transaction(async tx => {
		//TODO: check if this actually does a transaction

		const quizId = uuid();
		await tx.insert(quizzes).values({
			id: quizId,
			title: data.quizTitle,
			description: data.quizDescription ?? null,
			timeLimit: data.timeLimit,
			topicId: data.associatedTopicId,
			userId
		});

		for (const [i, q] of data.questions.entries()) {
			const questionId = uuid();

			if (q.type === 'TF') {
				await tx.insert(trueFalseQuestions).values({
					id: questionId,
					quizId,
					questionText: q.questionText,
					order: i
				});

				await tx.insert(quizKeyEntries).values({
					id: uuid(),
					quizId,
					questionId,
					answerValue: JSON.stringify(q.answer)
				});
			} else {
				await tx.insert(multipleChoiceQuestions).values({
					id: questionId,
					quizId,
					questionText: q.questionText,
					order: i,
					options: q.options
				});

				await tx.insert(quizKeyEntries).values({
					id: uuid(),
					quizId,
					questionId,
					answerValue: JSON.stringify(q.answer)
				});
			}
		}

		return { quizId };
	});
};

export const deleteQuiz = async (quizId: string): Promise<void> => {
	await db.transaction(async tx => {
		await tx.update(quizzes).set({ deleted: 1 }).where(eq(quizzes.id, quizId));
	});

	//revalidatePath(); TODO: later?
};
