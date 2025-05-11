import 'server-only';
import { db } from '@/db';
import { topics } from '@/db/schema/topics';
import { desc, eq } from 'drizzle-orm';

export async function getTopics() {
	return db
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
}

export async function getTopic(id: string) {
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
}
