'use server';

import { v4 as uuid } from 'uuid';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { topics } from '@/db/schema/topics';
import { createTopicValidator, updateTopicValidator } from './validators';
import { eq } from 'drizzle-orm';
import { quizzes } from '@/db/schema/quizzes';

const createTopic = async (raw: unknown) => {
	const data = createTopicValidator.parse(raw);

	await db.insert(topics).values({
		id: uuid(),
		title: data.title,
		description: data.description ?? null,
		readTime: data.readTime.toString(),
		content: data.content,
		category: data.category,
		userId: data.userId,
		...(data.publishedAt && { publishedAt: data.publishedAt })
	});

	revalidatePath('/topics');
};
export default createTopic;

export async function updateTopic(raw: unknown) {
	const { id, title, description, content, category, readTime } =
		updateTopicValidator.parse(raw);

	await db
		.update(topics)
		.set({
			title,
			description: description ?? null,
			content,
			category,
			readTime: readTime.toString(),
			updatedAt: new Date().toISOString()
		})
		.where(eq(topics.id, id));
}

export async function deleteTopic(topicId: string) {
	await db
		.update(quizzes)
		.set({ deleted: 1, updatedAt: new Date().toISOString() })
		.where(eq(quizzes.topicId, topicId));

	await db.delete(topics).where(eq(topics.id, topicId));
}
