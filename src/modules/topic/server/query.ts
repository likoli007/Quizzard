import 'server-only';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { topics } from '@/db/schema/topics';
import { favorites } from '@/db/schema/favorites';

export const getTopics = async () =>
	db
		.select({
			id: topics.id,
			title: topics.title,
			description: topics.description,
			content: topics.content,
			category: topics.category,
			publishedAt: topics.publishedAt,
			readTime: topics.readTime
		})
		.from(topics)
		.where(eq(topics.deleted, 0))
		.orderBy(desc(topics.publishedAt));

export const getFavoriteTopics = async (userId: string) =>
	db
		.select({
			id: topics.id,
			title: topics.title,
			description: topics.description,
			readTime: topics.readTime,
			content: topics.content,
			category: topics.category,
			userId: topics.userId,
			publishedAt: topics.publishedAt,
			createdAt: topics.createdAt,
			updatedAt: topics.updatedAt,
			favoritedAt: favorites.createdAt
		})
		.from(favorites)
		.innerJoin(topics, eq(favorites.topicId, topics.id))
		.where(and(eq(favorites.userId, userId), eq(favorites.deleted, 0)))
		.orderBy(desc(favorites.createdAt));

export const getTopic = async (id: string) => {
	const [topic] = await db
		.select({
			id: topics.id,
			title: topics.title,
			description: topics.description,
			content: topics.content,
			category: topics.category,
			publishedAt: topics.publishedAt,
			readTime: topics.readTime,
			userId: topics.userId,
			createdAt: topics.createdAt,
			updatedAt: topics.updatedAt,
			deleted: topics.deleted
		})
		.from(topics)
		.where(and(eq(topics.id, id), eq(topics.deleted, 0)));

	return topic;
};

export const getTopicsByUserId = async (userId: string) => {
	const topicsByUser = await db
		.select()
		.from(topics)
		.where(and(eq(topics.userId, userId), eq(topics.deleted, 0)))
		.orderBy(desc(topics.publishedAt));

	return topicsByUser;
};
