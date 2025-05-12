import 'server-only';
import { desc, eq } from 'drizzle-orm';

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
		.where(eq(favorites.userId, userId))
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
			updatedAt: topics.updatedAt
		})
		.from(topics)
		.where(eq(topics.id, id));

	return topic;
};

export const getTopicsByUserId = async (userId: string) => {
	const topicsByUser = await db
		.select()
		.from(topics)
		.where(eq(topics.userId, userId))
		.orderBy(desc(topics.publishedAt));

	return topicsByUser;
};
