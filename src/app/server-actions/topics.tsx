'use server';

import { v4 as uuid } from 'uuid';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { topics } from '@/db/schema/topics';
import { createTopicValidator } from '@/db/schema/topics';

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
