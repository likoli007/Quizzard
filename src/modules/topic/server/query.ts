import 'server-only';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { topics } from '@/db/schema/topics';

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
