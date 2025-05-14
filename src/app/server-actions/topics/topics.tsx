'use server';

import { v4 as uuid } from 'uuid';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { topics } from '@/db/schema/topics';
import { quizzes } from '@/db/schema/quizzes';
import { favorites } from '@/db/schema/favorites';

import { createTopicValidator, updateTopicValidator } from './validators';
import { auth } from '@/auth';
import { getTopic } from '@/modules/topic/server/query';

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

export const updateTopic = async (raw: unknown) => {
	const { id, title, description, content, category, readTime } =
		updateTopicValidator.parse(raw);

	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) {
		throw new Error('Unauthorized');
	}

	const topic = await getTopic(id);

	if (!topic) {
		throw new Error('Topic not found');
	}

	if (topic.userId !== userId) {
		throw new Error('Forbidden: You are not allowed to update this topic');
	}

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

	revalidatePath('/topics');
	revalidatePath(`/topics/${id}`);
};

export const deleteTopic = async (topicId: string) => {
	const session = await auth();
	const userId = session?.user?.id;

	if (!userId) {
		throw new Error('Unauthorized');
	}

	const topic = await getTopic(topicId);

	if (!topic) {
		throw new Error('Topic not found');
	}

	if (topic.userId !== userId) {
		throw new Error('Forbidden: You are not allowed to delete this topic');
	}

	await db.transaction(async tx => {
		await tx.delete(favorites).where(eq(favorites.topicId, topicId));

		await tx
			.update(quizzes)
			.set({ deleted: 1, updatedAt: new Date().toISOString() })
			.where(eq(quizzes.topicId, topicId));

		await tx
			.update(topics)
			.set({ deleted: 1, updatedAt: new Date().toISOString() })
			.where(eq(topics.id, topicId));
	});

	revalidatePath('/topics');
	revalidatePath(`/topics/${topicId}`);
};

export const addFavorite = async (userId: string, topicId: string) => {
	await db
		.insert(favorites)
		.values({ id: uuid(), userId, topicId })
		.onConflictDoNothing();

	revalidatePath('/topics');
};

export const removeFavorite = async (userId: string, topicId: string) => {
	await db
		.delete(favorites)
		.where(eq(favorites.userId, userId) && eq(favorites.topicId, topicId));

	revalidatePath('/topics');
};

export const getFavoriteTopicIds = async (userId: string) => {
	const rows = await db
		.select({ topicId: favorites.topicId })
		.from(favorites)
		.where(eq(favorites.userId, userId));

	return new Set(rows.map(r => r.topicId));
};
