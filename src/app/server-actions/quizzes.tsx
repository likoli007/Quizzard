'use server';

//import { v4 as uuidv4 } from 'uuid';
import { v4 as uuid } from 'uuid';

import { db } from '@/db';
import {
	trueFalseQuestions,
	multipleChoiceQuestions
} from '@/db/schema/questions';
import { quizKeyEntries } from '@/db/schema/quizKeys';
import { quizzes } from '@/db/schema/quizzes';
import { topics } from '@/db/schema/topics';
import { createTopicQuizSchema } from '@/modules/gift/components/create-quiz-form/schema';

export const createTopicWithQuiz = async (
	rawData: unknown,
	userId: string
): Promise<{ topicId: string; quizId: string }> => {
	const data = createTopicQuizSchema.parse(rawData);

	return db.transaction(async tx => {
		//TODO: check if this actually does a transaction
		const topicId = uuid();
		await tx.insert(topics).values({
			id: topicId,
			title: data.title,
			description: data.description ?? null,
			content: data.content,
			category: data.category,
			userId,
			...(data.publishedAt && { publishedAt: data.publishedAt })
		});

		const quizId = uuid();
		await tx.insert(quizzes).values({
			id: quizId,
			title: data.quizTitle,
			description: data.quizDescription ?? null,
			timeLimit: data.timeLimit,
			topicId,
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

		return { topicId, quizId };
	});
};
