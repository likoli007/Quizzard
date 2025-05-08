'use server';

import { v4 as uuid } from 'uuid';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { topics } from '@/db/schema/topics';
import { createTopicValidator } from '@/db/schema/topics';
import { eq } from 'drizzle-orm';
import { read } from 'fs';

export async function createTopic(raw: unknown) {
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
}

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
		.orderBy(topics.publishedAt);
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
