'use server';

import { v4 as uuid } from 'uuid';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { createTopicValidator, topics } from '@/db/schema/topics';

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
